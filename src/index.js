const express = require('express');
const rateLimit = require('express-rate-limit')
const { ServerConfig } = require('./config');
const {createProxyMiddleware} = require('http-proxy-middleware')
const apiRoutes = require('./routes');
const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
	max: 300, // Limit each IP to 3 requests per `window` (here, per 2 minutes)

})

app.use(express.json());
app.use(express.urlencoded({extended : true}));
//app.use('/flightsService' , createProxyMiddleware({target : ServerConfig.FLIGHT_SERVICE_URL , changeOrigin : true}));

//We can also use below,then there will be no need of adding a seperate /flightsService/api route in Flight Service


app.use('/flightsService' , createProxyMiddleware(
                                                    {
                                                        target : ServerConfig.FLIGHT_SERVICE_URL , 
                                                        changeOrigin : true,
                                                        pathRewrite : {'^/flightService' : '/'}//
                                                    }));



app.use('/bookingService' , createProxyMiddleware({target : ServerConfig.BOOKING_SERVICE_URL , changeOrigin : true}));
// console.log('code after routing');
app.use(limiter);
app.use('/api', apiRoutes);



app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);

});
