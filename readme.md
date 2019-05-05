# Bray Train Times

Currently, there is only one skill available on the market "4NextTrain - Realtime Irish Rail" which doesn't really work. I believe the problem is with recognizing Irish towns names. I've tested it a little bit and Alexa can't tell a difference between 'Bray' or 'Break'.

I've developed this skill with the help of Dabble Lab (https://www.youtube.com/watch?v=T2xc42UlYqo).

Once asked, Alexa calls external Api provided free of charge from Irish Rails. ('http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=BRAY') Data is returned in the Xml format and the parsed to Json. I've extracted the departure times in order for Alexa to read them out.

### 1st attempt
![alt text](https://github.com/maciekzdaleka/Bray-Train-Times/blob/master/assets/Screen1.PNG) 

### Direction of the train added
![alt text](https://github.com/maciekzdaleka/Bray-Train-Times/blob/master/assets/Screen2.PNG)
