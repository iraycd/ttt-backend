FROM node:lts-alpine
LABEL maintainer "Ray Ch<i@iraycd.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./

RUN yarn

# Copy app sources
COPY . .
# Run linters and tests
RUN yarn lint

# Expose application port
EXPOSE 5000
# In production environment
ENV NODE_ENV production

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && yarn start