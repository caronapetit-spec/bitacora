#!/usr/bin/env bash
# Publica una versión nueva de Bitácora.
#
#   ./publicar.sh "describe el cambio"
#
# Sube a la vez los tres sitios donde vive el número de versión. Si se
# desincronizan, el teléfono se queda con la versión vieja sin avisar:
#
#   index.html    const BUILD      → lo que la app cree que es
#   version.json  build            → lo que hay publicado, para comparar
#   sw.js         const CACHE      → invalida la caché del teléfono

set -e
cd "$(dirname "$0")"

actual=$(grep -oE 'const BUILD = "v[0-9]+"' index.html | grep -oE '[0-9]+')
if [ -z "$actual" ]; then
  echo "No encuentro la versión en index.html" >&2
  exit 1
fi
nueva=$((actual + 1))

sed -i "s/const BUILD = \"v$actual\"/const BUILD = \"v$nueva\"/" index.html
sed -i "s/const CACHE = \"bitacora-v$actual\"/const CACHE = \"bitacora-v$nueva\"/" sw.js
printf '{ "build": "v%s" }\n' "$nueva" > version.json

git add -A
git commit -m "${1:-Cambios en la app}"
git push origin main

echo
echo "Publicada v$nueva. En un minuto estará en:"
echo "  https://caronapetit-spec.github.io/bitacora/"
echo "El teléfono se actualizará solo la próxima vez que abras la app."
