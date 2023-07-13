
# Génération de modèle avec CLI

Ce projet fournit un moyen simple de générer un modèle Mongoose à l'aide de commandes CLI. Vous pouvez rapidement créer un modèle avec un schéma prédéfini et les opérations CRUD génériques.

## Installation :

- Clonez le projet à partir du repository GitHub

```bash
  git clone <URL_DU_REPOSITORY>
```

- Accédez au répertoire du projet

```bash
  cd nom-du-projet
```

- Installez les dépendances

```bash
  npm install
```

- Clonez le projet à partir du repository GitHub

```bash
  npm install my-project
  cd my-project
```

## Utilisation :

Pour utiliser ce script, exécutez simplement node run generateModel.js (ou le nom de votre fichier) dans votre terminal. Le script vous posera alors une série de questions pour déterminer comment le modèle doit être construit.

```bash
  npm run generate-model
```
    
## Questions :

- "Quel est le nom du modèle Mongoose ?" : Entrez ici le nom de votre modèle. Cela déterminera le nom du fichier qui sera généré et le nom de la classe Mongoose.

- "Combien de champs souhaitez-vous ajouter au modèle ?" : Entrez ici le nombre de champs que vous souhaitez pour votre modèle. Vous serez ensuite interrogé pour chaque champ.

### Pour chaque champ :

- "Nom du champ X:" : Entrez ici le nom du champ.

- "Type du champ X:" : Ici, vous devez entrer le type du champ. Les types de champs valides sont "String", "Number", "Date", "Boolean", "[String]", "[Number]", "[Date]", "[Boolean]", "Schema.Types.ObjectId", "[Schema.Types.ObjectId]", et tout autre nom de modèle existant dans votre dossier de modèles.

- "Ce champ est-il requis ?" : Répondez par oui ou non pour indiquer si le champ est obligatoire.

## Modèles existants : 

Si vous saisissez le nom d'un modèle existant comme type de champ, une référence à ce modèle sera créée. Cela signifie que la valeur du champ doit être un identifiant d'un document du modèle de référence.

Par exemple, si vous avez un modèle User et que vous créez un nouveau modèle avec un champ de type User, la valeur de ce champ doit être l'identifiant d'un document User.

## Fichier généré : 

Une fois que vous avez répondu à toutes les questions, le script générera un fichier .js dans le dossier models avec le nom du modèle que vous avez saisi. Ce fichier contiendra un modèle Mongoose avec les champs que vous avez définis.

Par exemple, si vous créez un modèle Book avec un champ title de type String, le script générera un fichier Book.js avec le contenu suivant :

```javascript
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: false }
});

const Book = mongoose.model("Book", BookSchema);

export default Book;
```

Après la génération, vous pouvez utiliser ce modèle dans votre application comme n'importe quel autre modèle Mongoose.

## Ajout de la logique métier dans un modèle Mongoose : 

Il est possible d'ajouter de la logique métier dans un modèle Mongoose. Ceci est utile lorsque vous voulez effectuer certaines opérations avant ou après certaines actions sur le modèle, comme la sauvegarde d'un document.

Voici comment cela fonctionne avec un exemple de modèle User:

```javascript
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { logToFile } from "../log/logger.js";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birth_date: { type: Date, required: false },
  created_at: { type: Date, default: Date.now },
});
```

### Méthodes middleware : 

Mongoose vous permet d'ajouter des fonctions middleware qui sont appelées à certains moments du cycle de vie d'un document. Par exemple, vous pouvez ajouter une fonction qui sera exécutée avant la sauvegarde (pre-save) d'un document :

```javascript
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
```

Dans cet exemple, avant la sauvegarde d'un utilisateur, le mot de passe est haché avec bcrypt.

### Méthodes d'instance :

Vous pouvez également ajouter des méthodes d'instance à votre schéma. Ces méthodes seront disponibles sur tous les documents de ce modèle. Par exemple, vous pouvez ajouter une méthode pour comparer un mot de passe donné avec le mot de passe haché :

```javascript
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
```

### Logique métier :

Vous pouvez aussi attacher des fonctions de logique métier directement au modèle :

```javascript
User.businessLogic = {
  findByAge: {
    route: "/findByAge/:age",
    method: "get",
    handler: async (req, res) => {
      try {
        const users = await User.find({
          birth_date: {
            $lte: new Date(new Date().setFullYear(new Date().getFullYear() - req.params.age)),
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - req.params.age - 1))
          }
        });

        logToFile(`findByAge: Recherche des utilisateurs par âge (${req.params.age})`, false);
        res.json(users);
      } catch (err) {
        logToFile(`findByAge: Erreur - ${err.message}`, true);
        res.status(500).json({ message: err.message });
      }
    },
  },
  login: {
    route: "/login",
    method: "post",
    handler: async (req, res) => {
      const { username, password } = req.body;

      try {
        logToFile(`login: Tentative de connexion de l'utilisateur (${username})`, false);

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ username });
        if (!user) {
          logToFile(`login: Nom d'utilisateur incorrect (${username})`, false);
          return res.status(404).json({ message: "Nom d'utilisateur incorrect." });
        }

        // Vérifier si le mot de passe correspond
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          logToFile(`login: Mot de passe incorrect (${username})`, false);
          return res.status(401).json({ message: "Mot de passe incorrect." });
        }

        logToFile(`login: Connexion réussie pour l'utilisateur (${username})`, false);
        // Renvoyer les informations de l'utilisateur
        res.json(user);
      } catch (err) {
        logToFile(`login: Erreur - ${err.message}`, true);
        res.status(500).json({ message: err.message });
      }
    },
  },
  // Ajouter ici d'autres méthodes spécifiques à User
};
```

Dans cet exemple, deux méthodes sont ajoutées : findByAge et login. Ces méthodes sont spécifiques à la logique métier de l'utilisateur et peuvent être appelées sur le modèle User.

Notez que ces fonctions ne font pas partie intégrante du schéma Mongoose et ne sont pas directement liées au cycle de vie d'un document. Elles sont plutôt attachées au modèle après sa définition. Ces fonctions pourraient également être définies dans un autre module et importées si nécessaire.

La logique métier que vous attachez au modèle dépend entièrement de vos besoins. Cela peut être aussi simple ou aussi complexe que nécessaire pour votre application.