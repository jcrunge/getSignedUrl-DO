# encoding-functions

#### Antes de empezar
Instalar localmente [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)

#### Pasos para iniciar proyecto localmente

``` Bash
cd functions && npm i
```

Define tus variables de entorno
``` Bash
firebase functions:config:set do.keyid="<key id DO>" do.secretaccesskey="<secret key DO>" do.bucket="<bucket>" do.region="<sfo3 | nyc3 | ...>"
```
Comando para verificar tus variables de entorno
``` Bash
firebase functions:config:get
```
Comando para pasar tus variables de entorno a la ejecución local de firebase
``` Bash
firebase functions:config:get > .runtimeconfig.json
```

Ejecutrar localmente firebase
``` Bash
firebase emulators:start  
```

Hacer deploy de tus cambios
``` Bash
firebase deploy
```

Para ver los logs de tu deploy puedes correr el siguiente comando
``` Bash
firebase functions:log   
```


### Example usage: 
parameters you can use for [mimetype](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
#### cURL
``` Bash
curl --location --request GET 'https://<service url>/api/file/signed/url?mimetype=image/png'
```

#### NodeJS - Axios
``` JavaScript
const mimetype = "image/png";
axios.get("https://<service url>/api/file/signed/url?mimetype="+mimetype)
```
