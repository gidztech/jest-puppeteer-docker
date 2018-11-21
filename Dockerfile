FROM alpeware/chrome-headless-trunk:rev-599821
EXPOSE 9222
ADD entrypoint.sh /usr/bin/
RUN apt-get update && apt-get install -y \
    iputils-ping \
    iproute2 \
    curl \
 && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/bin/start.sh"]
LABEL maintainer="info@alpeware.com"