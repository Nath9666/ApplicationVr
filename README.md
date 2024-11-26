# README

## Résumé du Projet

Ce projet consiste à créer une application immersive pour la conception et la visualisation de modèles LEGO en 3D, compatible avec les casques Meta Quest 3. L'application sera développée à la fois sous Unity et Unreal Engine pour offrir une expérience optimale sur différentes plateformes.

### Fonctionnalités Principales

* **Conception 3D** : Permet aux utilisateurs de créer et de manipuler des modèles LEGO en 3D.
* **Visualisation Immersive** : Utilisation de la réalité virtuelle pour visualiser les modèles LEGO de manière immersive.
* **Compatibilité Multi-Plateforme** : Développement sous Unity et Unreal Engine pour une compatibilité étendue.
* **Base de Données de Pièces LEGO** : Intégration d'une base de données contenant des modèles 3D de pièces LEGO.

## Prérequis

* **Unity** : Version 2021.3 ou supérieure
* **Unreal Engine** : Version 5.0 ou supérieure
* **Meta Quest 3** : Casque VR

## Installation

### Unity

1. Clonez le dépôt du projet.
2. Ouvrez Unity Hub et ajoutez le projet.
3. Assurez-vous d'avoir installé les modules Android Build Support et Oculus XR Plugin.
4. Ouvrez le projet dans Unity et configurez les paramètres de build pour Android.
5. Connectez votre casque Meta Quest 3 et lancez le build.

### Unreal Engine

1. Clonez le dépôt du projet.
2. Ouvrez Unreal Engine et ajoutez le projet.
3. Assurez-vous d'avoir installé les plugins VR nécessaires.
4. Configurez les paramètres de build pour Android.
5. Connectez votre casque Meta Quest 3 et lancez le build.

## Utilisation

1. Lancez l'application sur votre casque Meta Quest 3.
2. Utilisez les contrôleurs pour sélectionner et manipuler les pièces LEGO.
3. Construisez votre modèle en 3D et visualisez-le en réalité virtuelle.

## Annexes

### Base de Données de Pièces LEGO en 3D

La base de données contient des modèles 3D de pièces LEGO, organisés par catégorie et type. Chaque entrée comprend :

* **Nom de la pièce**
* **ID de la pièce**
* **Modèle 3D** le dossier de la pieces
* **Catégorie** (ex. : briques, plaques, accessoires)
* **Dimensions**

Pour les categorie on prend celle de [Bricklinks](https://www.bricklink.com/v2/main.page)

Vous trouverez la [base de donnée](./Models/_Bdd.json) ansi que les models dans [Models](./Models)

#### Exemple de Structure de la Base de Données

```json
{
  "pieces": [
    {
        "id": "3003",
        "name": "Brique 2x2",
        "model": "models/3001.fbx",
        "category": "Brick",
        "dimensions": "2x2"
      }
  ]
}
```

### Contribution

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalité`).
3. Commitez vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalité`).
5. Ouvrez une Pull Request.

### Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
