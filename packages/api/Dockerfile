FROM node:lts-buster

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
#**
#*  +-+-+-+-+-+-+-+-+
#*  |M|a|K|3|r|D|^|0|  ~> ∞ & ⤼
#*  +-+-+-+-+-+-+-+-+
#*
#*  handcoded with 🤍 by 0xjO5i <0x@josi.io>
#*/
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
LABEL MakerDAO - <0x@josi.io>
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

################################################################################
ARG MAKER_BADGES=/maker/badges
ARG NGROK_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
################################################################################

ENV LOG_LEVEL debug
ENV NPM_CONFIG_LOGLEVEL info

################################################################################
RUN curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
################################################################################
RUN apt-get update
RUN apt-get install -y sudo init git yarn automake make build-essential
RUN apt-get clean && \
 dpkg-divert --local --rename --add /sbin/udevadm && \
 ln -s /bin/true /sbin/udevadm
RUN rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/*
################################################################################

## NGROK >>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ##
RUN cd $MAKER_BADGES; wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
RUN unzip ./ngrok-stable-linux-amd64.zip
RUN ./ngrok authtoken $NGROK_AUTH_TOKEN
RUN mv ./ngrok /usr/bin/
COPY ./ngrok.yml /root/.ngrok2/ngrok.yml
## >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ##

## BADGES >>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ##
COPY . $MAKER_BADGES/

WORKDIR $MAKER_BADGES

RUN npm i -g ts-node;
RUN npm i -g typescript@^2.7.0;
RUN yarn install;
RUN yarn build;

ENV VIRTUAL_HOST mkr.technology
ENV VIRTUAL_PORT 3333

EXPOSE 80 443 3333

CMD ["/maker/badges/entrypoint.sh"]
