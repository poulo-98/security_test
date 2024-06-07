const express = require('express');
const fs = require('fs');
const path = require('path');
const { ClickCount } = require('./database');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'user_data.json');

// Vérifier si le fichier existe, sinon le créer
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
    console.log('Fichier user_data.json créé et initialisé avec un tableau vide.');
} else {
    console.log('Fichier user_data.json déjà existant.');
}


// Route pour gérer la demande à la racine de l'application
app.get('/', async (req, res) => {
    console.log('Chargement mis à jour:');
    try {
        let clickCount = await ClickCount.findOne();
        if (!clickCount) {
            clickCount = await ClickCount.create();
        }
        clickCount.nombreChargement += 1;
        await clickCount.save();
        console.log('Nombre de Chargement mis à jour:', clickCount.nombreChargement);
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (dbErr) {
        console.error('Erreur de mise à jour du nombre de clics:', dbErr);
        res.status(500).json({message: 'Erreur de mise à jour du nombre de clics'});
    }
});

// Servir les fichiers statiques depuis le répertoire public
app.use(express.static(path.join(__dirname, 'public')));
// Route pour récupérer les valeurs depuis l'URL et les stocker dans un fichier
app.get('/user/:username/:email/:telephoneNumber', async (req, res) => {
    const { username, email, telephoneNumber } = req.params;

    const userData = { username, email, telephoneNumber };
    console.log('Données utilisateur reçues:', userData);

    // Lire les données existantes du fichier
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            res.status(500).json({ message: 'Erreur de lecture du fichier de données utilisateur' });
            return;
        }

        let json = [];
        try {
            json = JSON.parse(data);
            // Si ce n'est pas un tableau, on initialise comme un tableau vide
            if (!Array.isArray(json)) {
                json = [];
            }
        } catch (parseErr) {
            console.error('Erreur de parsing JSON:', parseErr);
        }

        // Ajouter les nouvelles données
        json.push(userData);

        // Écrire les données mises à jour dans le fichier
        fs.writeFile(dataFilePath, JSON.stringify(json, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Erreur d\'écriture dans le fichier:', writeErr);
                res.status(500).json({ message: 'Erreur de stockage des données utilisateur' });
                return;
            }
            console.log('Données utilisateur stockées avec succès.');

            // Retarder la redirection d'une seconde
            setTimeout(() => {
                res.redirect(`/index.html?username=${username}&email=${email}&telephoneNumber=${telephoneNumber}`);
            }, 1000);
        });
    });
});

// Route pour augmenter le compteur de clics
app.post('/api/click', async (req, res) => {

    try {
        let clickCount = await ClickCount.findOne();
        if (!clickCount) {
            clickCount = await ClickCount.create();
        }
        clickCount.clicks += 1;
        await clickCount.save();
        console.log('Nombre de clics mis à jour:', clickCount.clicks);

        // Retarder la redirection d'une seconde
        setTimeout(() => {
            res.redirect(`/image.html?clicks=${clickCount.clicks}`);
        }, 1000);
    } catch (dbErr) {
        console.error('Erreur de mise à jour du nombre de clics:', dbErr);
        res.status(500).json({ message: 'Erreur de mise à jour du nombre de clics' });
    }
});

// Route pour afficher le nombre de clics
app.get('/clicks', async (req, res) => {
    try {
        let clickCount = await ClickCount.findOne();
        if (!clickCount) {
            clickCount = await ClickCount.create();
        }

        res.send(`
            <html lang="">
            <body>
                <div style="display: flex; align-content: center;justify-content: center">
                    <img src="image.png" alt="Image" />
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Erreur lors de la récupération du nombre de clics:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre de clics' });
    }
});
app.get('/get-clicks', async (req, res) => {
    try {
        let clickCount = await ClickCount.findOne();
        if (!clickCount) {
            clickCount = await ClickCount.create();
        }

        res.send(`
            <html lang="">
            <body>
                <div style="display: flex;flex-direction: column; align-content: center;justify-content: center; ">
                 <h1>Nombre de chargements : ${clickCount.nombreChargement}</h1>
                 <h1>Nombre de clicks : ${clickCount.clicks}</h1>
                </div>
                
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Erreur lors de la récupération du nombre de clics:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre de clics' });
    }
});

app.get('/api/click-count', async (req, res) => {
    try {
        let clickCount = await ClickCount.findOne();
        if (!clickCount) {
            clickCount = await ClickCount.create();
        }
        res.json({ clicks: clickCount.clicks });
    } catch (err) {
        console.error('Erreur lors de la récupération du nombre de clics:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre de clics' });
    }
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});