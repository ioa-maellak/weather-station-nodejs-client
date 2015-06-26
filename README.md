# weather-station-nodejs-client
Contains a nodejs application which runs on ruspberry pi and send information to nodejs server.

#Install depedencies

sudo apt-get install screen
screen -d -R s1
sudo apt-get install python-dev python-smbus python-setuptools python-requests python3-dev python3-requests libxml2-dev libxslt1-dev python-lxml i2c-tools

#Install Airpi software

mkdir -p airpi/log
cd airpi/
git clone https://github.com/ioa-maellak/AirPi.git
cd AirPi/

In cfg/sensors.cfg disable sensors that do not exist or do not function:
[TGS2600]
enabled = no

In cfg/outputs.cfg edit:
[JSONOutput]
enabled = yes
outputDir = /home/pi/airpi/log
outputFile = airpilog.json

echo "export PATH=$PATH:/home/pi/airpi/AirPi" >> /home/pi/.profile
cp supports/calibration.py outputs/
cp supports/support.py outputs/
sudo reboot

sudo python airpi.py

#Install nodejs

sudo apt-get install nodejs npm

# Download the dependencies
npm install

# Run the program
nodejs index.js ~/pi/airpi/log/airpioutput.json ras_id ras_pass

