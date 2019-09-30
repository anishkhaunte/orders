
var pub = new Redis();

module.exports = {
	publish (channel, message){
		pub.publish(channel, message);
	}
};


