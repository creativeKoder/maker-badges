FROM openjdk:11-jre

LABEL MakerDAO - <degen@3cc.vc>
################################################################################
ARG MAKER_BADGES=/maker/badges
################################################################################
################################################################################
################################################################################
# We need java and node in this image, so we'll start with java (cause it's
# more hairy), and then dump in the node Dockerfile below
# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    4ED778F539E3634C779C87C6D7062848A1AB005C \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    74F12602B6F1C4E913FAA37AD3A89613643B6201 \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    A48C2BEE680E841632CD4E44F07496B3EB3C1762 \
    108F52B48DB57BB0CC439B2997B01419BD92F80A \
    B9E2F5981AA6E0CD28160D9FF13993A75599653C \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV LOG_LEVEL debug
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 15.6.0

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt

################################################################################
RUN apt-get update
RUN apt-get install -y git yarn automake make build-essential awscli
RUN apt-get clean
RUN rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/*
################################################################################

# RUN mkdir -p /root/.aws
# COPY /Users/josi/.aws /root/

## >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ##
# RUN mkdir -p /home/root/.ssh
# COPY ../../../id_rsa /root/.ssh/id_rsa
# RUN ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts
# RUN chmod 600 /root/.ssh/id_rsa

# RUN git clone git@github.com:creativeKoder/maker-badges.git ${MAKER_BADGES}

# COPY ../../../entrypoint.sh $MAKER_BADGES/
COPY . $MAKER_BADGES
WORKDIR $MAKER_BADGES

RUN npm i -g typescript@^2.7.0
RUN npm i -g ts-node
RUN yarn install

# Configuration for dynamo-admin to know where to hit dynamo.
# ENV DYNAMO_ENDPOINT http://localhost:8002/

ENV VIRTUAL_HOST mkr.technology
ENV VIRTUAL_PORT 3333

# Main proxy on 8000, dynamo-admin on 8001, dynamodb on 8002
EXPOSE 3333

# ENTRYPOINT ["/maker/badges/entrypoint.sh"]
CMD ["node", "build/src/local.js"]
