
//let userSchema = require('./new-user.schema')
//ajv.addSchema(userSchema, 'new-user')

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
let validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.send(errorResponse(ajv.errors))
    }
    next()
  }
}

var fs        = require('fs');
const path = require('path')
var AJV        = require("ajv");
var ajv        = new AJV({allErrors:true, jsonPointers: true});
//require('ajv-errors')(ajv);


function loadModels() {
    fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
        var models = require('./models/' + file);
        for (var m in models) {
            if (models.hasOwnProperty(m)) {
                allmodels[m] = models[m];
            }
        }
    });
}

function validateSchemaByType(modelschema, schema) {
    var schemaTypes = ["object", "array", "number", "string", "boolean"];
    var data = {};
    var referencedSchema;
    if (modelschema.properties[schema] && schemaTypes.indexOf(modelschema.properties[schema].type) === -1) {
        referencedSchema = modelschema.properties[schema].type;
        if (!data.definitions) data.definitions = {};
        data.id = modelschema.id;
        delete modelschema.id;
        delete modelschema.additionalProperties;
        data.definitions[schema] = modelschema;
        if (!data.oneOf) data.oneOf = [];
        data.oneOf.push({
            "$ref": "#/definitions/" + schema
        });

        data.definitions[schema].properties[schema].properties = allmodels[referencedSchema].properties;
        data.definitions[schema].properties[schema].type = allmodels[referencedSchema].type;
        data.definitions[schema].properties[schema].required = allmodels[referencedSchema].required;
        delete data.definitions[schema].required;
    } else if (modelschema.properties[schema] && modelschema.properties[schema].type === "array") {
        referencedSchema = modelschema.properties[schema].items.$ref;
        data = modelschema;
        data.properties[schema].items = allmodels[referencedSchema].properties;
        data.properties[schema].items.required = allmodels[referencedSchema].required;
        delete data.additionalProperties;
    }
    return data;
}

module.exports.validator = function (value, schema) {
    return (req, res, next) => {
        var modelSchema = _.cloneDeep(allmodels[schema]);
        
        var updatedSchema = validateSchemaByType(modelSchema, schema);

        var val = ajv.compile(updatedSchema);
        value = _.omitBy(value, _.isNil);
        var valid = val(value) && ajv.validate(modelSchema, value);
        
        if (!valid) {
            //return {errors: val.errors || ajv.errors};
            return Q.reject({name: 'SessionTokenNotFound'})
        } else {
            return next();
        }
    }    
}

loadModels();

