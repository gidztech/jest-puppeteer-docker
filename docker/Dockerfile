FROM alpeware/chrome-headless-trunk:rev-599821
EXPOSE 9222
ARG CHROMIUM_ADDITIONAL_ARGS
ENV CHROMIUM_ADDITIONAL_ARGS=${CHROMIUM_ADDITIONAL_ARGS}
ADD entrypoint.sh /usr/bin/entrypoint.sh
RUN apt-get update && apt-get install -y \
    dumb-init \
    iputils-ping \
    iproute2 \
    curl \
 && rm -rf /var/lib/apt/lists/* \
 && chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/bin/entrypoint.sh"]
LABEL maintainer="info@alpeware.com"