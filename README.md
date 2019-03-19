# Cloud Computing Project 1

Docker container for [HW2](https://github.com/ZakFahey/cloud-computing-hw2) and [HW3](https://github.com/ZakFahey/cloud-computing-hw3).

## Running the image

This image is hosted on Docker Hub and can be fetched using the command `docker pull zakfahey/proj1:latest`. You can also build the image locally using the `docker build` command.

Like in the previous assignments, you need an API key from openweathermap.org to run the external API portion of the project. You will need to register an account and get an API key if you do not have one.

To start the image, run the command `docker run -p 80:80 -p 8000:8000 -e API_KEY='<your api key>' zakfahey/proj1`. The web service will then be available on port 80, and the API will be available on port 8000. On Windows, you need to run the command `docker-machine ip` to find the address of the services.
