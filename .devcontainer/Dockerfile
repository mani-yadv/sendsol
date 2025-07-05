# Use a compatible base image
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install necessary tools
RUN apt-get update && apt-get install -y curl tar sudo

# Install lazygit
RUN LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*') && \
    curl -Lo /tmp/lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_arm64.tar.gz" && \
    tar xf /tmp/lazygit.tar.gz -C /tmp && \
    sudo install /tmp/lazygit /usr/local/bin && \
    rm /tmp/lazygit.tar.gz && \
    rm /tmp/lazygit