#!/bin/bash

# Naviga nella directory del progetto
cd /home/pi/booking-management-system

# Installa le dipendenze (solo la prima volta o se package.json cambia)
npm install

# Costruisci l'applicazione per la produzione
npm run build

# Avvia il server Node.js in background usando nohup
# nohup disaccoppia il processo dal terminale, quindi continuerà a funzionare anche se chiudi la sessione SSH.
# Il log del server verrà scritto in nohup.out
nohup npm start > nohup.out 2>&1 &

echo "Applicazione avviata in background. Controlla nohup.out per i log."
echo "Per fermare l'applicazione, trova il processo Node.js (es. con 'pgrep node') e uccidilo (es. 'kill <PID>')"