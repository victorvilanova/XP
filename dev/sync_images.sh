#!/bin/bash

# Sincroniza a pasta de imagens do armazenamento (ajuste os caminhos conforme necessário)
rsync -av /home/xplicit/public_html/storage/app/public/images/ /home/xplicit/public_html/dev/storage/app/public/images/

# Se houver imagens também na pasta public (caso aplicável)
rsync -av /home/xplicit/public_html/storage/app/public/images/ /home/xplicit/public_html/dev/storage/app/public/images
rsync -av /home/xplicit/public_html/storage/app/public/videos /home/xplicit/public_html/dev/storage/app/public/videos
