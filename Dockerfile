FROM alpeware/chrome-headless-trunk:rev-599821
EXPOSE 9222
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN apt-get update && apt-get install -y \
    dumb-init \
    iputils-ping \
    iproute2 \
    curl \
 && rm -rf /var/lib/apt/lists/* \
 && chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/entrypoint.sh"]
LABEL maintainer="info@alpeware.com"