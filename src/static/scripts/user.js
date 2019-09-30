

var user ={

	getUserList : function (){
		console.log('inside user list')
		return $.ajax({
         type: 'GET',
         url: CONSTANTS.API_BASE_URL + '/users/',
         dataType: "json"
      	});
		/*
		$.ajax({
         type: 'GET',
         url: rootURL + '/' + id,
         dataType: "json",
         success: function(data){
               //$('#btnDelete').show();
               //renderDetails(data);
               console.log('Populate user details')
         }
      });*/
	},

	getUserDetails: function(user_id){

		return $.ajax({
         type: 'GET',
         url: CONSTANTS.API_BASE_URL + '/users/' + user_id,
         dataType: "json"
         });
	},

	createUser : function(role){
       return $.ajax({
           type: 'POST',
           contentType: 'application/json',
           url: CONSTANTS.API_BASE_URL+'/users',
           dataType: "json",
           data: userJson(role)
       });
	}
}

function userJson (role) {
	return JSON.stringify({
    	"first_name": 'ABC',
    	"last_name": 'XYZ',
    	"role": role
    });
}