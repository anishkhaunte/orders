module.exports = {
    "organization" : {
        "id" : "organization",
        "type": "object",
        "additionalProperties": false,
        "properties": {
            "name": {
                "type": 'string',
                "maxLength":50,
                "minLength":2
            }
        },
        "required": ['name']
    }
};
