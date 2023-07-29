import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birth_date: { type: Date, required: false },
  created_at: { type: Date, default: Date.now },
});

// Méthode pre-save pour hasher le mot de passe avant de l'enregistrer dans la base de données
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
    console.error(`Error hashing password: ${error.message}`);
    next(error);
  }
});

// Méthode pour comparer le mot de passe fourni avec le mot de passe enregistré dans la base de données
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", UserSchema);

// Logique métier spécifique à User
User.businessLogic = {
  findByAge: {
    route: "/findByAge/:age",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const users = await User.find({
          birth_date: {
            $lte: new Date(new Date().setFullYear(new Date().getFullYear() - req.params.age)),
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - req.params.age - 1))
          }
        });
        res.json(users);
      } catch (err) {
        next(err);
      }
    },
  },
  login: {
    route: "/login",
    method: "post",
    handler: async (req, res, next) => {
      const { username, password } = req.body;

      try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ message: "Incorrect username." });
        }

        // Vérifier si le mot de passe correspond
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(401).json({ message: "Incorrect password." });
        }

        // Renvoyer les informations de l'utilisateur
        res.json(user);
      } catch (err) {
        next(err);
      }
    },
  },
  // Ajouter ici d'autres méthodes spécifiques à User
};

export default User;
