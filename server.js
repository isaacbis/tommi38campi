// Importa le librerie necessarie
const express = require('express'); // Libreria per creare il server
const bodyParser = require('body-parser'); // Per leggere il corpo delle richieste
const cors = require('cors'); // Per consentire richieste da frontend su un dominio diverso

// Inizializza l'applicazione Express
const app = express();

// Configura middleware
app.use(cors()); // Abilita richieste da frontend
app.use(bodyParser.json()); // Converte il corpo delle richieste in JSON

// Struttura per memorizzare le prenotazioni
let reservations = {}; // Oggetto che memorizza tutte le prenotazioni

// Endpoint GET per ottenere tutte le prenotazioni
app.get('/api/reservations', (req, res) => {
    res.json(reservations); // Risponde con tutte le prenotazioni in formato JSON
});

// Endpoint POST per aggiungere una prenotazione
app.post('/api/reservations', (req, res) => {
    const { field, date, time, user } = req.body; // Estrai i dati dal corpo della richiesta

    if (!reservations[field]) reservations[field] = {}; // Crea l'oggetto per il campo, se non esiste
    if (!reservations[field][date]) reservations[field][date] = {}; // Crea l'oggetto per la data, se non esiste

    if (reservations[field][date][time]) {
        // Lo slot è già prenotato
        return res.status(400).json({ error: 'Slot già prenotato!' });
    }

    // Aggiunge la prenotazione
    reservations[field][date][time] = user;
    res.json({ message: 'Prenotazione effettuata con successo!' });
});

// Endpoint DELETE per cancellare una prenotazione
app.delete('/api/reservations', (req, res) => {
    const { field, date, time, user } = req.body; // Estrai i dati dal corpo della richiesta

    if (reservations[field]?.[date]?.[time] === user) {
        delete reservations[field][date][time]; // Cancella la prenotazione
        return res.json({ message: 'Prenotazione cancellata!' });
    }

    res.status(400).json({ error: 'Non puoi cancellare questa prenotazione.' });
});

// Avvia il server sulla porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
