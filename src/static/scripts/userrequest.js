var userrequest ={

	getPendingRequests : function() {
		return $.ajax({
         	type: 'GET',
         	url: CONSTANTS.API_BASE_URL + '/management/requests/list',
         	dataType: "json"
         });
	},

	requestAccess : function(user_id) {
       return $.ajax({
           type: 'POST',
           contentType: 'application/json',
           url: CONSTANTS.API_BASE_URL+'/management/request_access',
           dataType: "json",
           data: userJson(role)
       });
	},

	approveRequest : function(user_id) {
		return $.ajax({
           type: 'POST',
           contentType: 'application/json',
           url: CONSTANTS.API_BASE_URL+'/management/approve_request',
           dataType: "json",
           data: userJson(role)
       });	
	}
}