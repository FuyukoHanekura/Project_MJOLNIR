// Base de départ : générée une seule fois à partir du prototype (liste, REL, alternatives),
// puis écrite en dur. Ne pas modifier les ids : ils sont référencés par les séances.
import type { Exercise } from '../types'

export const EXERCISES_SEED: Exercise[] = [
  {
    "id": "tirage_vertical",
    "name": "Tirage vertical",
    "nameEn": "Lat pulldown",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "cable",
    "machineType": "Poulie haute (lat pulldown), barre large",
    "machineTypeEn": "High pulley (lat pulldown), wide bar",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "mid_back",
      "rear_delts"
    ],
    "alternatives": [
      "tractions",
      "tirage_prise_serree",
      "traction_assistee",
      "tirage_unilateral",
      "tirage_supination",
      "tractions_supination"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_incline_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Assis, cuisses calées sous les coussins. Tire la barre vers le haut de la poitrine en menant avec les coudes, sans balancer le buste.",
    "instructionsEn": "Sit with your thighs locked under the pads. Pull the bar to your upper chest, leading with the elbows, without swinging your torso.",
    "isCustom": false
  },
  {
    "id": "tirage_prise_serree",
    "name": "Tirage vertical prise neutre",
    "nameEn": "Neutral-grip lat pulldown",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec poignée triangle (prise neutre serrée)",
    "machineTypeEn": "High pulley with a triangle handle (close neutral grip)",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "mid_back"
    ],
    "alternatives": [
      "tirage_vertical",
      "tractions",
      "traction_assistee",
      "tirage_unilateral",
      "tirage_supination",
      "tractions_supination"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_incline_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Prise neutre : les coudes restent près du corps. Amplitude complète, jusqu'à sentir l'étirement des dorsaux en haut.",
    "instructionsEn": "Neutral grip: keep your elbows close to your body. Use full range of motion and feel the lats stretch at the top.",
    "isCustom": false
  },
  {
    "id": "tirage_supination",
    "name": "Tirage vertical supination",
    "nameEn": "Underhand lat pulldown",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "cable",
    "machineType": "Poulie haute, barre droite, paumes vers toi",
    "machineTypeEn": "High pulley, straight bar, palms facing you",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps"
    ],
    "alternatives": [
      "tirage_vertical",
      "tirage_prise_serree",
      "tractions",
      "traction_assistee",
      "tirage_unilateral",
      "tractions_supination"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_incline_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Mains à largeur d'épaules. Cette prise fait davantage travailler les biceps.",
    "instructionsEn": "Hands shoulder-width apart. This grip puts more work on the biceps.",
    "isCustom": false
  },
  {
    "id": "tractions",
    "name": "Tractions pronation",
    "nameEn": "Pull-ups",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "bodyweight",
    "machineType": "Barre de traction fixe",
    "machineTypeEn": "Fixed pull-up bar",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "mid_back",
      "rear_delts",
      "forearms"
    ],
    "alternatives": [
      "tirage_vertical",
      "tirage_prise_serree",
      "tractions_supination",
      "traction_assistee",
      "tirage_unilateral",
      "tirage_supination"
    ],
    "antagonists": [
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_incline_barre"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_barre"
    ],
    "instructions": "Départ bras tendus, épaules basses. Monte le menton au-dessus de la barre sans élan.",
    "instructionsEn": "Start with arms straight and shoulders down. Pull your chin over the bar without kipping.",
    "isCustom": false
  },
  {
    "id": "tractions_supination",
    "name": "Tractions supination (chin-up)",
    "nameEn": "Chin-ups",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "bodyweight",
    "machineType": "Barre de traction fixe, paumes vers toi",
    "machineTypeEn": "Fixed pull-up bar, palms facing you",
    "primaryMuscles": [
      "lats",
      "biceps"
    ],
    "secondaryMuscles": [
      "mid_back",
      "forearms"
    ],
    "alternatives": [
      "tractions",
      "tirage_vertical",
      "tirage_prise_serree",
      "traction_assistee",
      "tirage_unilateral",
      "tirage_supination"
    ],
    "antagonists": [
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_incline_barre"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_barre"
    ],
    "instructions": "Prise plus étroite qu'en pronation ; le biceps travaille beaucoup plus.",
    "instructionsEn": "Narrower grip than pull-ups; the biceps work much more.",
    "isCustom": false
  },
  {
    "id": "traction_assistee",
    "name": "Tractions assistées",
    "nameEn": "Assisted pull-ups",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "machine",
    "machineType": "Machine à tractions assistées (contrepoids)",
    "machineTypeEn": "Assisted pull-up machine (counterweight)",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "mid_back"
    ],
    "alternatives": [
      "tirage_vertical",
      "tirage_prise_serree",
      "tractions",
      "tirage_unilateral",
      "tirage_supination",
      "tractions_supination"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_incline_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Pose les genoux ou les pieds sur le plateau. Réduis peu à peu le contrepoids pour progresser vers les tractions libres.",
    "instructionsEn": "Place your knees or feet on the platform. Gradually reduce the counterweight to progress toward unassisted pull-ups.",
    "isCustom": false
  },
  {
    "id": "tirage_unilateral",
    "name": "Tirage vertical unilatéral",
    "nameEn": "Single-arm lat pulldown",
    "group": "back",
    "movementPattern": "vpull",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec poignée simple",
    "machineTypeEn": "High pulley with a single handle",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "mid_back"
    ],
    "alternatives": [
      "tirage_vertical",
      "tirage_prise_serree",
      "tractions",
      "traction_assistee",
      "tirage_supination",
      "tractions_supination"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_incline_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Un bras à la fois : corrige les déséquilibres droite/gauche et allonge l'amplitude.",
    "instructionsEn": "One arm at a time: fixes left/right imbalances and lengthens the range of motion.",
    "isCustom": false
  },
  {
    "id": "pullover_poulie",
    "name": "Pull-over à la poulie haute",
    "nameEn": "Cable pullover",
    "group": "back",
    "movementPattern": "pullover",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec barre droite ou corde",
    "machineTypeEn": "High pulley with a straight bar or rope",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "triceps",
      "abs"
    ],
    "alternatives": [
      "pullover_machine",
      "pullover_haltere",
      "tirage_vertical",
      "tirage_prise_serree",
      "tirage_supination",
      "tractions"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Bras presque tendus, tire en arc de cercle vers les cuisses. Isole les dorsaux sans les biceps.",
    "instructionsEn": "Arms nearly straight, pull in an arc toward your thighs. Isolates the lats without the biceps.",
    "isCustom": false
  },
  {
    "id": "pullover_machine",
    "name": "Pull-over à la machine",
    "nameEn": "Machine pullover",
    "group": "back",
    "movementPattern": "pullover",
    "equipmentType": "machine",
    "machineType": "Machine pull-over (dorsaux)",
    "machineTypeEn": "Pullover machine (lats)",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "chest",
      "triceps"
    ],
    "alternatives": [
      "pullover_haltere",
      "pullover_poulie",
      "tirage_vertical",
      "tirage_prise_serree",
      "tirage_supination",
      "tractions"
    ],
    "antagonists": [
      "developpe_epaules_machine",
      "developpe_militaire",
      "developpe_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "face_pull",
      "curl_pupitre"
    ],
    "instructions": "Coudes calés sur les appuis, ramène la barre vers le bas en contractant les dorsaux.",
    "instructionsEn": "Elbows resting on the pads, bring the bar down while squeezing the lats.",
    "isCustom": false
  },
  {
    "id": "pullover_haltere",
    "name": "Pull-over haltère",
    "nameEn": "Dumbbell pullover",
    "group": "back",
    "movementPattern": "pullover",
    "equipmentType": "dumbbell",
    "machineType": "Banc plat et un haltère tenu à deux mains",
    "machineTypeEn": "Flat bench and one dumbbell held with both hands",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "chest",
      "triceps"
    ],
    "alternatives": [
      "pullover_machine",
      "pullover_poulie",
      "tirage_vertical",
      "tirage_prise_serree",
      "tirage_supination",
      "tractions"
    ],
    "antagonists": [
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_couche_barre"
    ],
    "complements": [
      "rowing_barre",
      "rowing_haltere",
      "oiseau_halteres",
      "curl_barre"
    ],
    "instructions": "Allongé en travers du banc, descends l'haltère derrière la tête bras semi-tendus, puis remonte en arc.",
    "instructionsEn": "Lie across the bench, lower the dumbbell behind your head with slightly bent arms, then bring it back up in an arc.",
    "isCustom": false
  },
  {
    "id": "rowing_assis_poulie",
    "name": "Rowing assis à la poulie basse",
    "nameEn": "Seated cable row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec poignée triangle, pieds sur les cale-pieds",
    "machineTypeEn": "Low pulley with a triangle handle, feet on the footplates",
    "primaryMuscles": [
      "mid_back",
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "rear_delts",
      "lower_back"
    ],
    "alternatives": [
      "rowing_barre",
      "rowing_t",
      "rowing_machine",
      "rowing_haltere",
      "tirage_horizontal_large",
      "rowing_poulie_unilateral"
    ],
    "antagonists": [
      "developpe_machine",
      "developpe_couche_barre",
      "pec_deck"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "face_pull",
      "curl_pupitre",
      "shrugs"
    ],
    "instructions": "Dos droit, tire vers le nombril en serrant les omoplates. Ne t'aide pas du buste.",
    "instructionsEn": "Keep your back straight and pull toward your navel, squeezing the shoulder blades. Do not use your torso for momentum.",
    "isCustom": false
  },
  {
    "id": "rowing_machine",
    "name": "Rowing à la machine (appui poitrine)",
    "nameEn": "Chest-supported machine row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "machine",
    "machineType": "Machine rowing avec appui-poitrine",
    "machineTypeEn": "Row machine with a chest pad",
    "primaryMuscles": [
      "mid_back",
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "rear_delts"
    ],
    "alternatives": [
      "rowing_assis_poulie",
      "rowing_barre",
      "rowing_t",
      "rowing_haltere",
      "tirage_horizontal_large",
      "rowing_poulie_unilateral"
    ],
    "antagonists": [
      "developpe_machine",
      "developpe_couche_barre",
      "pec_deck"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "face_pull",
      "curl_pupitre",
      "shrugs"
    ],
    "instructions": "Poitrine plaquée au coussin. Tire les poignées en amenant les coudes derrière le corps.",
    "instructionsEn": "Chest against the pad. Pull the handles by bringing your elbows behind your body.",
    "isCustom": false
  },
  {
    "id": "rowing_barre",
    "name": "Rowing barre penché",
    "nameEn": "Bent-over barbell row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "barbell",
    "machineType": "Barre olympique ou barre EZ",
    "machineTypeEn": "Olympic barbell or EZ bar",
    "primaryMuscles": [
      "lats",
      "mid_back"
    ],
    "secondaryMuscles": [
      "biceps",
      "rear_delts",
      "lower_back",
      "traps"
    ],
    "alternatives": [
      "rowing_t",
      "rowing_assis_poulie",
      "rowing_machine",
      "rowing_haltere",
      "tirage_horizontal_large",
      "rowing_poulie_unilateral"
    ],
    "antagonists": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "ecartes_halteres"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "oiseau_halteres",
      "curl_barre",
      "shrugs"
    ],
    "instructions": "Buste penché à environ 45°, dos plat. Tire la barre vers le bas du ventre.",
    "instructionsEn": "Torso bent at about 45°, back flat. Pull the bar toward your lower stomach.",
    "isCustom": false
  },
  {
    "id": "rowing_haltere",
    "name": "Rowing haltère un bras",
    "nameEn": "One-arm dumbbell row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "dumbbell",
    "machineType": "Banc plat et un haltère",
    "machineTypeEn": "Flat bench and one dumbbell",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "mid_back",
      "biceps",
      "rear_delts"
    ],
    "alternatives": [
      "rowing_assis_poulie",
      "rowing_machine",
      "rowing_barre",
      "rowing_t",
      "rowing_poulie_unilateral",
      "tirage_vertical"
    ],
    "antagonists": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "ecartes_halteres"
    ],
    "complements": [
      "tirage_prise_serree",
      "tirage_supination",
      "oiseau_halteres",
      "curl_barre",
      "shrugs"
    ],
    "instructions": "Une main et un genou sur le banc. Tire le coude vers la hanche sans tourner le buste.",
    "instructionsEn": "One hand and one knee on the bench. Pull the elbow toward your hip without rotating your torso.",
    "isCustom": false
  },
  {
    "id": "rowing_t",
    "name": "Rowing barre en T",
    "nameEn": "T-bar row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "barbell",
    "machineType": "Barre en T ou machine T-bar",
    "machineTypeEn": "T-bar or T-bar row machine",
    "primaryMuscles": [
      "mid_back",
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "rear_delts",
      "traps",
      "lower_back"
    ],
    "alternatives": [
      "rowing_barre",
      "rowing_assis_poulie",
      "rowing_machine",
      "rowing_haltere",
      "tirage_horizontal_large",
      "rowing_poulie_unilateral"
    ],
    "antagonists": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "ecartes_halteres"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "oiseau_halteres",
      "curl_barre",
      "shrugs"
    ],
    "instructions": "Poitrine haute, dos neutre. Tire vers le sternum, coudes proches du corps.",
    "instructionsEn": "Chest up, neutral back. Pull toward your sternum with elbows close to your body.",
    "isCustom": false
  },
  {
    "id": "rowing_poulie_unilateral",
    "name": "Rowing poulie basse un bras",
    "nameEn": "Single-arm cable row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec poignée simple",
    "machineTypeEn": "Low pulley with a single handle",
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "mid_back",
      "biceps"
    ],
    "alternatives": [
      "rowing_haltere",
      "rowing_assis_poulie",
      "rowing_machine",
      "rowing_barre",
      "rowing_t",
      "tirage_vertical"
    ],
    "antagonists": [
      "developpe_machine",
      "developpe_couche_barre",
      "pec_deck"
    ],
    "complements": [
      "tirage_prise_serree",
      "tirage_supination",
      "face_pull",
      "curl_pupitre",
      "shrugs"
    ],
    "instructions": "Tire en tournant légèrement le buste pour prolonger le mouvement, puis contrôle le retour.",
    "instructionsEn": "Pull while rotating your torso slightly to extend the movement, then control the return.",
    "isCustom": false
  },
  {
    "id": "tirage_horizontal_large",
    "name": "Tirage horizontal prise large",
    "nameEn": "Wide-grip cable row",
    "group": "back",
    "movementPattern": "hpull",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec barre large (ou machine rowing prise large)",
    "machineTypeEn": "Low pulley with a wide bar (or wide-grip row machine)",
    "primaryMuscles": [
      "mid_back"
    ],
    "secondaryMuscles": [
      "rear_delts",
      "lats",
      "biceps"
    ],
    "alternatives": [
      "rowing_assis_poulie",
      "rowing_machine",
      "rowing_barre",
      "rowing_t"
    ],
    "antagonists": [
      "developpe_machine",
      "developpe_couche_barre",
      "pec_deck"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "face_pull",
      "curl_pupitre",
      "shrugs"
    ],
    "instructions": "Coudes écartés à hauteur d'épaules, tire vers le haut du ventre. Cible le milieu du dos et l'arrière d'épaule.",
    "instructionsEn": "Elbows flared at shoulder height, pull toward your upper stomach. Targets the mid back and rear delts.",
    "isCustom": false
  },
  {
    "id": "shrugs",
    "name": "Shrugs haltères",
    "nameEn": "Dumbbell shrugs",
    "group": "back",
    "movementPattern": "shrug",
    "equipmentType": "dumbbell",
    "machineType": "Haltères, barre ou machine à shrugs",
    "machineTypeEn": "Dumbbells, barbell or shrug machine",
    "primaryMuscles": [
      "traps"
    ],
    "secondaryMuscles": [
      "forearms",
      "mid_back"
    ],
    "alternatives": [
      "farmer_walk"
    ],
    "antagonists": [],
    "complements": [
      "elevations_laterales",
      "elevations_frontales",
      "rowing_barre"
    ],
    "instructions": "Hausse les épaules verticalement vers les oreilles, marque une pause en haut. Pas de rotations.",
    "instructionsEn": "Raise your shoulders straight up toward your ears and pause at the top. No rolling.",
    "isCustom": false
  },
  {
    "id": "souleve_de_terre",
    "name": "Soulevé de terre",
    "nameEn": "Deadlift",
    "group": "back",
    "movementPattern": "hinge",
    "equipmentType": "barbell",
    "machineType": "Barre olympique, disques, sol plat (ou trap-bar)",
    "machineTypeEn": "Olympic barbell, plates, flat floor (or trap bar)",
    "primaryMuscles": [
      "lower_back",
      "glutes",
      "hamstrings"
    ],
    "secondaryMuscles": [
      "traps",
      "lats",
      "forearms",
      "quads",
      "mid_back"
    ],
    "alternatives": [
      "rdl",
      "good_morning",
      "hip_thrust",
      "extension_lombaires",
      "squat_barre",
      "squat_smith"
    ],
    "antagonists": [
      "leg_extension",
      "squat_avant"
    ],
    "complements": [
      "pont_fessier",
      "kickback_poulie",
      "crunch"
    ],
    "instructions": "Barre contre les tibias, dos plat. Pousse le sol avec les jambes, puis étends les hanches.",
    "instructionsEn": "Bar against your shins, back flat. Push the floor away with your legs, then extend your hips.",
    "isCustom": false
  },
  {
    "id": "extension_lombaires",
    "name": "Extension lombaires (banc à 45°)",
    "nameEn": "45° back extension",
    "group": "back",
    "movementPattern": "bext",
    "equipmentType": "bodyweight",
    "machineType": "Banc à lombaires (hyperextension 45°)",
    "machineTypeEn": "45° back extension bench (hyperextension)",
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "alternatives": [
      "good_morning",
      "souleve_de_terre"
    ],
    "antagonists": [
      "crunch",
      "releve_jambes_suspendu"
    ],
    "complements": [
      "rdl",
      "pont_fessier"
    ],
    "instructions": "Descends le buste gainé jusqu'à sentir l'étirement, remonte jusqu'à l'alignement sans te cambrer.",
    "instructionsEn": "Lower your braced torso until you feel the stretch, then come up to alignment without arching.",
    "isCustom": false
  },
  {
    "id": "developpe_couche_barre",
    "name": "Développé couché barre",
    "nameEn": "Barbell bench press",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "barbell",
    "machineType": "Banc plat avec barre olympique (rack de sécurité)",
    "machineTypeEn": "Flat bench with Olympic barbell (safety rack)",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "alternatives": [
      "developpe_couche_halteres",
      "developpe_machine",
      "pompes",
      "developpe_decline",
      "dips",
      "developpe_incline_barre"
    ],
    "antagonists": [
      "rowing_barre",
      "rowing_haltere",
      "tirage_vertical"
    ],
    "complements": [
      "barre_front",
      "extension_dessus_tete",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Omoplates serrées, pieds ancrés. Descends la barre au milieu de la poitrine, poignets dans l'axe.",
    "instructionsEn": "Shoulder blades pinched, feet planted. Lower the bar to mid-chest, wrists stacked over the elbows.",
    "isCustom": false
  },
  {
    "id": "developpe_couche_halteres",
    "name": "Développé couché haltères",
    "nameEn": "Dumbbell bench press",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "dumbbell",
    "machineType": "Banc plat et haltères",
    "machineTypeEn": "Flat bench and dumbbells",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "alternatives": [
      "developpe_couche_barre",
      "developpe_machine",
      "pompes",
      "developpe_decline",
      "dips",
      "developpe_incline_barre"
    ],
    "antagonists": [
      "rowing_barre",
      "rowing_haltere",
      "tirage_vertical"
    ],
    "complements": [
      "barre_front",
      "extension_dessus_tete",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Plus d'amplitude qu'avec la barre. Rapproche les haltères en haut sans les entrechoquer.",
    "instructionsEn": "More range of motion than with the barbell. Bring the dumbbells together at the top without clanging them.",
    "isCustom": false
  },
  {
    "id": "developpe_incline_barre",
    "name": "Développé incliné barre",
    "nameEn": "Incline barbell press",
    "group": "chest",
    "movementPattern": "ipush",
    "equipmentType": "barbell",
    "machineType": "Banc incliné (30°) avec barre",
    "machineTypeEn": "Incline bench (30°) with barbell",
    "primaryMuscles": [
      "chest",
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_incline_halteres",
      "developpe_incline_machine",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine"
    ],
    "antagonists": [
      "rowing_barre",
      "rowing_haltere",
      "tirage_vertical"
    ],
    "complements": [
      "barre_front",
      "extension_dessus_tete",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Environ 30° d'inclinaison pour cibler le haut des pectoraux sans trop solliciter les épaules.",
    "instructionsEn": "About 30° of incline targets the upper chest without overloading the shoulders.",
    "isCustom": false
  },
  {
    "id": "developpe_incline_halteres",
    "name": "Développé incliné haltères",
    "nameEn": "Incline dumbbell press",
    "group": "chest",
    "movementPattern": "ipush",
    "equipmentType": "dumbbell",
    "machineType": "Banc incliné et haltères",
    "machineTypeEn": "Incline bench and dumbbells",
    "primaryMuscles": [
      "chest",
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_incline_barre",
      "developpe_incline_machine",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine"
    ],
    "antagonists": [
      "rowing_barre",
      "rowing_haltere",
      "tirage_vertical"
    ],
    "complements": [
      "barre_front",
      "extension_dessus_tete",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Banc à 30°, coudes à environ 45° du buste. Pousse en rapprochant les haltères.",
    "instructionsEn": "Bench at 30°, elbows about 45° from your torso. Press while bringing the dumbbells together.",
    "isCustom": false
  },
  {
    "id": "developpe_incline_machine",
    "name": "Développé incliné à la machine",
    "nameEn": "Incline machine press",
    "group": "chest",
    "movementPattern": "ipush",
    "equipmentType": "machine",
    "machineType": "Machine développé incliné (ou Smith avec banc incliné)",
    "machineTypeEn": "Incline press machine (or Smith machine with an incline bench)",
    "primaryMuscles": [
      "chest",
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_incline_barre",
      "developpe_incline_halteres",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine"
    ],
    "antagonists": [
      "rowing_assis_poulie",
      "rowing_machine",
      "tirage_vertical"
    ],
    "complements": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "elevations_laterales_poulie",
      "pec_deck"
    ],
    "instructions": "Règle le siège pour que les poignées partent du haut de la poitrine.",
    "instructionsEn": "Adjust the seat so the handles start at the top of your chest.",
    "isCustom": false
  },
  {
    "id": "developpe_machine",
    "name": "Développé pectoraux à la machine",
    "nameEn": "Machine chest press",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "machine",
    "machineType": "Machine chest press assise (convergente)",
    "machineTypeEn": "Seated chest press machine (converging)",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "alternatives": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "pompes",
      "developpe_decline",
      "dips",
      "developpe_incline_barre"
    ],
    "antagonists": [
      "rowing_assis_poulie",
      "rowing_machine",
      "tirage_vertical"
    ],
    "complements": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "elevations_laterales_poulie",
      "pec_deck"
    ],
    "instructions": "Dos calé, poignées au niveau du milieu de la poitrine. Pratique pour finir en sécurité.",
    "instructionsEn": "Back supported, handles at mid-chest level. Handy for finishing safely.",
    "isCustom": false
  },
  {
    "id": "developpe_decline",
    "name": "Développé décliné",
    "nameEn": "Decline bench press",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "barbell",
    "machineType": "Banc décliné avec barre ou haltères",
    "machineTypeEn": "Decline bench with barbell or dumbbells",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine",
      "pompes",
      "dips",
      "developpe_incline_barre"
    ],
    "antagonists": [
      "rowing_barre",
      "rowing_haltere",
      "tirage_vertical"
    ],
    "complements": [
      "barre_front",
      "extension_dessus_tete",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Cible le bas des pectoraux. Utilise un rack ou un partenaire pour la sécurité.",
    "instructionsEn": "Targets the lower chest. Use a rack or a spotter for safety.",
    "isCustom": false
  },
  {
    "id": "ecartes_halteres",
    "name": "Écartés haltères",
    "nameEn": "Dumbbell flyes",
    "group": "chest",
    "movementPattern": "fly",
    "equipmentType": "dumbbell",
    "machineType": "Banc plat et haltères légers",
    "machineTypeEn": "Flat bench and light dumbbells",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "ecartes_incline_halteres",
      "pec_deck",
      "ecartes_poulie",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres"
    ],
    "antagonists": [
      "oiseau_halteres",
      "face_pull",
      "rowing_barre"
    ],
    "complements": [
      "developpe_decline",
      "developpe_machine",
      "developpe_incline_barre"
    ],
    "instructions": "Coudes légèrement fléchis, ouvre en arc de cercle jusqu'à l'étirement, puis referme.",
    "instructionsEn": "Elbows slightly bent, open in an arc until you feel the stretch, then close.",
    "isCustom": false
  },
  {
    "id": "ecartes_incline_halteres",
    "name": "Écartés inclinés haltères",
    "nameEn": "Incline dumbbell flyes",
    "group": "chest",
    "movementPattern": "fly",
    "equipmentType": "dumbbell",
    "machineType": "Banc incliné et haltères légers",
    "machineTypeEn": "Incline bench and light dumbbells",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "ecartes_halteres",
      "pec_deck",
      "ecartes_poulie",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres"
    ],
    "antagonists": [
      "oiseau_halteres",
      "face_pull",
      "rowing_barre"
    ],
    "complements": [
      "developpe_decline",
      "developpe_machine",
      "developpe_incline_barre"
    ],
    "instructions": "Même geste que les écartés à plat, banc incliné pour cibler le haut des pectoraux.",
    "instructionsEn": "Same movement as flat flyes, with the bench inclined to target the upper chest.",
    "isCustom": false
  },
  {
    "id": "pec_deck",
    "name": "Pec deck (butterfly)",
    "nameEn": "Pec deck (butterfly)",
    "group": "chest",
    "movementPattern": "fly",
    "equipmentType": "machine",
    "machineType": "Machine pec deck / butterfly",
    "machineTypeEn": "Pec deck / butterfly machine",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "ecartes_halteres",
      "ecartes_incline_halteres",
      "ecartes_poulie",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres"
    ],
    "antagonists": [
      "face_pull",
      "reverse_fly_machine",
      "rowing_assis_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_decline",
      "developpe_incline_machine"
    ],
    "instructions": "Dos calé, coudes à hauteur d'épaules. Referme sans que les poignées ne claquent.",
    "instructionsEn": "Back supported, elbows at shoulder height. Close without letting the handles slam together.",
    "isCustom": false
  },
  {
    "id": "ecartes_poulie",
    "name": "Écartés à la poulie vis-à-vis",
    "nameEn": "Cable crossover",
    "group": "chest",
    "movementPattern": "fly",
    "equipmentType": "cable",
    "machineType": "Deux poulies hautes ou moyennes (câbles croisés)",
    "machineTypeEn": "Two high or mid pulleys (crossed cables)",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "ecartes_halteres",
      "ecartes_incline_halteres",
      "pec_deck",
      "ecartes_poulie_basse",
      "developpe_couche_barre",
      "developpe_couche_halteres"
    ],
    "antagonists": [
      "face_pull",
      "reverse_fly_machine",
      "rowing_assis_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_decline",
      "developpe_incline_machine"
    ],
    "instructions": "Tension continue sur tout le mouvement ; croise les mains devant toi en fin de course.",
    "instructionsEn": "Constant tension throughout; cross your hands in front of you at the end of the movement.",
    "isCustom": false
  },
  {
    "id": "ecartes_poulie_basse",
    "name": "Écartés poulie basse (haut des pecs)",
    "nameEn": "Low cable flyes (upper chest)",
    "group": "chest",
    "movementPattern": "fly",
    "equipmentType": "cable",
    "machineType": "Deux poulies basses (câbles croisés)",
    "machineTypeEn": "Two low pulleys (crossed cables)",
    "primaryMuscles": [
      "chest",
      "shoulders"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "ecartes_halteres",
      "ecartes_incline_halteres",
      "pec_deck",
      "ecartes_poulie",
      "developpe_incline_barre",
      "developpe_incline_halteres"
    ],
    "antagonists": [
      "face_pull",
      "reverse_fly_machine",
      "rowing_assis_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_couche_barre",
      "developpe_incline_machine"
    ],
    "instructions": "Pars des poulies basses et remonte les mains devant le menton pour cibler le haut des pectoraux.",
    "instructionsEn": "Start from the low pulleys and bring your hands up in front of your chin to target the upper chest.",
    "isCustom": false
  },
  {
    "id": "pompes",
    "name": "Pompes",
    "nameEn": "Push-ups",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "bodyweight",
    "machineType": "Au sol, poids du corps",
    "machineTypeEn": "On the floor, bodyweight",
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "shoulders",
      "abs"
    ],
    "alternatives": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine",
      "developpe_decline",
      "dips",
      "developpe_incline_barre"
    ],
    "antagonists": [
      "rowing_assis_poulie",
      "rowing_machine",
      "tractions"
    ],
    "complements": [
      "dips_banc",
      "pompes_diamant",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Corps gainé en planche, coudes à environ 45°. Poitrine au ras du sol.",
    "instructionsEn": "Body braced in a plank, elbows at about 45°. Chest to just above the floor.",
    "isCustom": false
  },
  {
    "id": "dips",
    "name": "Dips (buste penché)",
    "nameEn": "Chest dips (leaning forward)",
    "group": "chest",
    "movementPattern": "hpush",
    "equipmentType": "bodyweight",
    "machineType": "Barres parallèles (ou machine à dips assistés)",
    "machineTypeEn": "Parallel bars (or assisted dip machine)",
    "primaryMuscles": [
      "chest",
      "triceps"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_machine",
      "pompes",
      "developpe_decline",
      "developpe_couche_serre"
    ],
    "antagonists": [
      "rowing_assis_poulie",
      "rowing_machine",
      "tractions"
    ],
    "complements": [
      "dips_banc",
      "pompes_diamant",
      "elevations_laterales",
      "ecartes_halteres"
    ],
    "instructions": "Penche le buste vers l'avant pour cibler les pectoraux. Descends jusqu'à environ 90° au coude.",
    "instructionsEn": "Lean your torso forward to target the chest. Lower until your elbows reach about 90°.",
    "isCustom": false
  },
  {
    "id": "developpe_militaire",
    "name": "Développé militaire barre",
    "nameEn": "Barbell overhead press",
    "group": "shoulders",
    "movementPattern": "vpush",
    "equipmentType": "barbell",
    "machineType": "Barre olympique au rack, debout ou assis",
    "machineTypeEn": "Olympic barbell on a rack, standing or seated",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps",
      "traps",
      "chest"
    ],
    "alternatives": [
      "developpe_epaules_halteres",
      "developpe_epaules_machine",
      "arnold_press",
      "elevations_frontales",
      "elevations_laterales",
      "elevations_laterales_poulie"
    ],
    "antagonists": [
      "tirage_vertical",
      "tirage_prise_serree"
    ],
    "complements": [
      "elevations_laterales_machine",
      "oiseau_halteres",
      "barre_front"
    ],
    "instructions": "Gainage fort, fessiers serrés. Pousse la barre à la verticale en passant la tête sous elle.",
    "instructionsEn": "Strong brace, glutes squeezed. Press the bar vertically, moving your head through once it passes.",
    "isCustom": false
  },
  {
    "id": "developpe_epaules_halteres",
    "name": "Développé épaules haltères",
    "nameEn": "Dumbbell shoulder press",
    "group": "shoulders",
    "movementPattern": "vpush",
    "equipmentType": "dumbbell",
    "machineType": "Banc réglé à 80-90° et haltères",
    "machineTypeEn": "Bench set at 80-90° and dumbbells",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps",
      "traps"
    ],
    "alternatives": [
      "developpe_militaire",
      "developpe_epaules_machine",
      "arnold_press",
      "elevations_laterales",
      "elevations_laterales_poulie",
      "elevations_frontales"
    ],
    "antagonists": [
      "tirage_vertical",
      "tirage_prise_serree"
    ],
    "complements": [
      "elevations_laterales_machine",
      "oiseau_halteres",
      "barre_front"
    ],
    "instructions": "Assis, dos calé. Pousse les haltères au-dessus de la tête sans te cambrer.",
    "instructionsEn": "Seated with back supported. Press the dumbbells overhead without arching.",
    "isCustom": false
  },
  {
    "id": "developpe_epaules_machine",
    "name": "Développé épaules à la machine",
    "nameEn": "Machine shoulder press",
    "group": "shoulders",
    "movementPattern": "vpush",
    "equipmentType": "machine",
    "machineType": "Machine shoulder press assise",
    "machineTypeEn": "Seated shoulder press machine",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_militaire",
      "developpe_epaules_halteres",
      "arnold_press",
      "developpe_incline_barre",
      "developpe_incline_halteres",
      "developpe_incline_machine"
    ],
    "antagonists": [
      "tirage_vertical",
      "tirage_prise_serree"
    ],
    "complements": [
      "elevations_laterales_poulie",
      "elevations_laterales_machine",
      "face_pull",
      "extension_triceps_poulie"
    ],
    "instructions": "Règle le siège pour que les poignées partent à hauteur d'épaules. Trajectoire guidée, pratique pour les séries lourdes.",
    "instructionsEn": "Adjust the seat so the handles start at shoulder height. Guided path, handy for heavy sets.",
    "isCustom": false
  },
  {
    "id": "arnold_press",
    "name": "Arnold press",
    "nameEn": "Arnold press",
    "group": "shoulders",
    "movementPattern": "vpush",
    "equipmentType": "dumbbell",
    "machineType": "Haltères, banc à dossier",
    "machineTypeEn": "Dumbbells, bench with backrest",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "alternatives": [
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_epaules_machine",
      "developpe_incline_barre",
      "developpe_incline_halteres",
      "developpe_incline_machine"
    ],
    "antagonists": [
      "tirage_vertical",
      "tirage_prise_serree"
    ],
    "complements": [
      "elevations_laterales",
      "elevations_frontales",
      "oiseau_halteres",
      "barre_front"
    ],
    "instructions": "Départ paumes vers toi, tourne les poignets pendant la poussée. Sollicite les trois faisceaux de l'épaule.",
    "instructionsEn": "Start with palms facing you and rotate your wrists during the press. Works all three heads of the shoulder.",
    "isCustom": false
  },
  {
    "id": "elevations_laterales",
    "name": "Élévations latérales haltères",
    "nameEn": "Dumbbell lateral raises",
    "group": "shoulders",
    "movementPattern": "lraise",
    "equipmentType": "dumbbell",
    "machineType": "Haltères légers",
    "machineTypeEn": "Light dumbbells",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "traps"
    ],
    "alternatives": [
      "elevations_laterales_poulie",
      "elevations_frontales",
      "elevations_laterales_machine",
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_epaules_machine"
    ],
    "antagonists": [
      "oiseau_halteres",
      "face_pull"
    ],
    "complements": [
      "arnold_press",
      "shrugs"
    ],
    "instructions": "Coudes légèrement fléchis, monte jusqu'à l'horizontale. Contrôle la descente.",
    "instructionsEn": "Elbows slightly bent, raise to horizontal. Control the way down.",
    "isCustom": false
  },
  {
    "id": "elevations_laterales_poulie",
    "name": "Élévations latérales à la poulie",
    "nameEn": "Cable lateral raises",
    "group": "shoulders",
    "movementPattern": "lraise",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec poignée simple",
    "machineTypeEn": "Low pulley with a single handle",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "traps"
    ],
    "alternatives": [
      "elevations_laterales",
      "elevations_frontales",
      "elevations_laterales_machine",
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_epaules_machine"
    ],
    "antagonists": [
      "face_pull",
      "reverse_fly_machine"
    ],
    "complements": [
      "arnold_press",
      "shrugs"
    ],
    "instructions": "Tension constante dès le bas du mouvement, contrairement aux haltères.",
    "instructionsEn": "Constant tension from the very bottom of the movement, unlike dumbbells.",
    "isCustom": false
  },
  {
    "id": "elevations_laterales_machine",
    "name": "Élévations latérales à la machine",
    "nameEn": "Machine lateral raises",
    "group": "shoulders",
    "movementPattern": "lraise",
    "equipmentType": "machine",
    "machineType": "Machine lateral raise assise",
    "machineTypeEn": "Seated lateral raise machine",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "elevations_laterales",
      "elevations_laterales_poulie",
      "elevations_frontales",
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_epaules_machine"
    ],
    "antagonists": [
      "face_pull",
      "reverse_fly_machine"
    ],
    "complements": [
      "arnold_press",
      "shrugs"
    ],
    "instructions": "Coudes calés sous les coussins, lève en écartant les bras. Facile à exécuter proprement.",
    "instructionsEn": "Elbows under the pads, lift by spreading your arms. Easy to perform cleanly.",
    "isCustom": false
  },
  {
    "id": "elevations_frontales",
    "name": "Élévations frontales",
    "nameEn": "Front raises",
    "group": "shoulders",
    "movementPattern": "lraise",
    "equipmentType": "dumbbell",
    "machineType": "Haltères ou disque",
    "machineTypeEn": "Dumbbells or plate",
    "primaryMuscles": [
      "shoulders"
    ],
    "secondaryMuscles": [
      "chest",
      "traps"
    ],
    "alternatives": [
      "elevations_laterales",
      "elevations_laterales_poulie",
      "elevations_laterales_machine",
      "developpe_militaire",
      "developpe_epaules_halteres",
      "developpe_epaules_machine"
    ],
    "antagonists": [
      "oiseau_halteres",
      "face_pull"
    ],
    "complements": [
      "arnold_press",
      "shrugs"
    ],
    "instructions": "Lève la charge devant toi jusqu'à hauteur des yeux, bras presque tendus, sans élan.",
    "instructionsEn": "Lift the weight in front of you to eye level, arms almost straight, without swinging.",
    "isCustom": false
  },
  {
    "id": "face_pull",
    "name": "Face pull",
    "nameEn": "Face pull",
    "group": "shoulders",
    "movementPattern": "rdelt",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec corde",
    "machineTypeEn": "High pulley with rope",
    "primaryMuscles": [
      "rear_delts"
    ],
    "secondaryMuscles": [
      "mid_back",
      "traps",
      "shoulders"
    ],
    "alternatives": [
      "reverse_fly_machine",
      "oiseau_halteres"
    ],
    "antagonists": [
      "pec_deck",
      "ecartes_poulie",
      "developpe_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "elevations_laterales_poulie"
    ],
    "instructions": "Tire la corde vers le visage en écartant les mains. Coudes hauts, rotation externe en fin de mouvement.",
    "instructionsEn": "Pull the rope toward your face while spreading your hands. High elbows, external rotation at the end of the movement.",
    "isCustom": false
  },
  {
    "id": "reverse_fly_machine",
    "name": "Oiseau à la machine (pec deck inversé)",
    "nameEn": "Reverse pec deck",
    "group": "shoulders",
    "movementPattern": "rdelt",
    "equipmentType": "machine",
    "machineType": "Machine pec deck en mode inversé",
    "machineTypeEn": "Pec deck machine in reverse mode",
    "primaryMuscles": [
      "rear_delts"
    ],
    "secondaryMuscles": [
      "mid_back",
      "traps"
    ],
    "alternatives": [
      "face_pull",
      "oiseau_halteres"
    ],
    "antagonists": [
      "pec_deck",
      "ecartes_poulie",
      "developpe_machine"
    ],
    "complements": [
      "rowing_assis_poulie",
      "rowing_machine",
      "elevations_laterales_poulie"
    ],
    "instructions": "Face au dossier, ouvre les bras vers l'arrière sans monter les épaules.",
    "instructionsEn": "Facing the backrest, open your arms backward without shrugging.",
    "isCustom": false
  },
  {
    "id": "oiseau_halteres",
    "name": "Oiseau haltères penché",
    "nameEn": "Bent-over dumbbell reverse fly",
    "group": "shoulders",
    "movementPattern": "rdelt",
    "equipmentType": "dumbbell",
    "machineType": "Haltères légers, buste penché ou banc incliné",
    "machineTypeEn": "Light dumbbells, bent over or on an incline bench",
    "primaryMuscles": [
      "rear_delts"
    ],
    "secondaryMuscles": [
      "mid_back",
      "traps"
    ],
    "alternatives": [
      "face_pull",
      "reverse_fly_machine"
    ],
    "antagonists": [
      "ecartes_halteres",
      "ecartes_incline_halteres",
      "developpe_couche_barre"
    ],
    "complements": [
      "rowing_barre",
      "rowing_haltere",
      "elevations_laterales"
    ],
    "instructions": "Buste incliné, dos plat, écarte les bras comme des ailes. Charge légère, mouvement contrôlé.",
    "instructionsEn": "Torso tilted, back flat, spread your arms like wings. Light weight, controlled movement.",
    "isCustom": false
  },
  {
    "id": "curl_barre",
    "name": "Curl barre EZ",
    "nameEn": "EZ-bar curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "barbell",
    "machineType": "Barre EZ (ou barre droite)",
    "machineTypeEn": "EZ bar (or straight bar)",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms"
    ],
    "alternatives": [
      "curl_halteres",
      "curl_pupitre",
      "curl_poulie",
      "curl_incline",
      "curl_marteau",
      "curl_concentre"
    ],
    "antagonists": [
      "barre_front",
      "extension_dessus_tete"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_barre",
      "curl_inverse"
    ],
    "instructions": "Coudes collés au corps, ne balance pas le buste. Descends lentement.",
    "instructionsEn": "Elbows tight to your body, do not swing your torso. Lower slowly.",
    "isCustom": false
  },
  {
    "id": "curl_halteres",
    "name": "Curl haltères alterné",
    "nameEn": "Alternating dumbbell curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "dumbbell",
    "machineType": "Haltères",
    "machineTypeEn": "Dumbbells",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms"
    ],
    "alternatives": [
      "curl_barre",
      "curl_pupitre",
      "curl_poulie",
      "curl_incline",
      "curl_marteau",
      "curl_concentre"
    ],
    "antagonists": [
      "barre_front",
      "extension_dessus_tete"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_barre",
      "curl_inverse"
    ],
    "instructions": "Tourne le poignet vers l'extérieur en montant (supination). Un bras après l'autre.",
    "instructionsEn": "Rotate your wrist outward as you lift (supination). One arm after the other.",
    "isCustom": false
  },
  {
    "id": "curl_marteau",
    "name": "Curl marteau",
    "nameEn": "Hammer curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "dumbbell",
    "machineType": "Haltères, prise neutre",
    "machineTypeEn": "Dumbbells, neutral grip",
    "primaryMuscles": [
      "biceps",
      "forearms"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_pupitre",
      "curl_poulie",
      "curl_incline",
      "curl_concentre"
    ],
    "antagonists": [
      "barre_front",
      "extension_dessus_tete"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_barre",
      "curl_inverse"
    ],
    "instructions": "Pouces vers le haut : cible le brachial et l'avant-bras en plus du biceps.",
    "instructionsEn": "Thumbs up: targets the brachialis and forearm in addition to the biceps.",
    "isCustom": false
  },
  {
    "id": "curl_pupitre",
    "name": "Curl pupitre",
    "nameEn": "Preacher curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "machine",
    "machineType": "Pupitre Larry Scott avec barre EZ, ou machine preacher curl",
    "machineTypeEn": "Preacher bench (Scott) with EZ bar, or preacher curl machine",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms"
    ],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_poulie",
      "curl_incline",
      "curl_marteau",
      "curl_concentre"
    ],
    "antagonists": [
      "extension_triceps_poulie",
      "extension_triceps_barre"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_assis_poulie",
      "curl_inverse"
    ],
    "instructions": "Bras calés sur le pupitre : plus d'élan possible. Ne verrouille pas complètement en bas.",
    "instructionsEn": "Arms supported on the pad: less momentum possible. Do not fully lock out at the bottom.",
    "isCustom": false
  },
  {
    "id": "curl_poulie",
    "name": "Curl à la poulie basse",
    "nameEn": "Cable curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec barre droite ou EZ",
    "machineTypeEn": "Low pulley with a straight or EZ bar",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms"
    ],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_pupitre",
      "curl_incline",
      "curl_marteau",
      "curl_concentre"
    ],
    "antagonists": [
      "extension_triceps_poulie",
      "extension_triceps_barre"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_assis_poulie",
      "curl_inverse"
    ],
    "instructions": "Tension constante sur toute l'amplitude. Bon en finition.",
    "instructionsEn": "Constant tension over the full range. Good as a finisher.",
    "isCustom": false
  },
  {
    "id": "curl_incline",
    "name": "Curl incliné haltères",
    "nameEn": "Incline dumbbell curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "dumbbell",
    "machineType": "Banc incliné à 45-60° et haltères",
    "machineTypeEn": "Incline bench at 45-60° and dumbbells",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms"
    ],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_pupitre",
      "curl_poulie",
      "curl_marteau",
      "curl_concentre"
    ],
    "antagonists": [
      "barre_front",
      "extension_dessus_tete"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_barre",
      "curl_inverse"
    ],
    "instructions": "Bras en arrière du corps : étire la longue portion du biceps.",
    "instructionsEn": "Arms behind your body: stretches the long head of the biceps.",
    "isCustom": false
  },
  {
    "id": "curl_concentre",
    "name": "Curl concentré",
    "nameEn": "Concentration curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "dumbbell",
    "machineType": "Haltère, assis sur un banc",
    "machineTypeEn": "Dumbbell, seated on a bench",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_marteau",
      "curl_pupitre",
      "curl_poulie",
      "curl_incline"
    ],
    "antagonists": [
      "barre_front",
      "extension_dessus_tete"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_barre",
      "curl_inverse"
    ],
    "instructions": "Coude appuyé contre la cuisse, isole le biceps sans triche.",
    "instructionsEn": "Elbow braced against your thigh, isolates the biceps with no cheating.",
    "isCustom": false
  },
  {
    "id": "curl_machine",
    "name": "Curl à la machine",
    "nameEn": "Machine biceps curl",
    "group": "arms",
    "movementPattern": "curl",
    "equipmentType": "machine",
    "machineType": "Machine à biceps assise",
    "machineTypeEn": "Seated biceps machine",
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "curl_barre",
      "curl_halteres",
      "curl_marteau",
      "curl_pupitre",
      "curl_poulie",
      "curl_incline"
    ],
    "antagonists": [
      "extension_triceps_poulie",
      "extension_triceps_barre"
    ],
    "complements": [
      "tirage_vertical",
      "tirage_prise_serree",
      "rowing_assis_poulie",
      "curl_inverse"
    ],
    "instructions": "Aligne l'articulation du coude avec l'axe de la machine en réglant le siège.",
    "instructionsEn": "Align your elbow joint with the machine axis by adjusting the seat.",
    "isCustom": false
  },
  {
    "id": "curl_inverse",
    "name": "Curl inversé",
    "nameEn": "Reverse curl",
    "group": "arms",
    "movementPattern": "forearm",
    "equipmentType": "barbell",
    "machineType": "Barre EZ, prise pronation",
    "machineTypeEn": "EZ bar, overhand grip",
    "primaryMuscles": [
      "forearms",
      "biceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "curl_poignets",
      "farmer_walk",
      "curl_marteau",
      "curl_barre",
      "curl_halteres",
      "curl_pupitre"
    ],
    "antagonists": [],
    "complements": [
      "curl_incline",
      "curl_concentre",
      "rowing_barre"
    ],
    "instructions": "Mains en pronation. Cible le brachio-radial et les extenseurs de l'avant-bras.",
    "instructionsEn": "Hands in pronation. Targets the brachioradialis and forearm extensors.",
    "isCustom": false
  },
  {
    "id": "extension_triceps_poulie",
    "name": "Extension triceps à la poulie (corde)",
    "nameEn": "Rope triceps pushdown",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec corde",
    "machineTypeEn": "High pulley with rope",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete",
      "extension_poulie_haute_corde",
      "dips_banc",
      "kickback_triceps"
    ],
    "antagonists": [
      "curl_pupitre",
      "curl_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_couche_barre",
      "developpe_epaules_machine"
    ],
    "instructions": "Coudes collés, écarte la corde en bas du mouvement pour contracter fort.",
    "instructionsEn": "Elbows tucked, spread the rope apart at the bottom of the movement for a strong contraction.",
    "isCustom": false
  },
  {
    "id": "extension_triceps_barre",
    "name": "Extension triceps à la poulie (barre)",
    "nameEn": "Bar triceps pushdown",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec barre droite ou en V",
    "machineTypeEn": "High pulley with straight or V bar",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "barre_front",
      "extension_dessus_tete",
      "extension_poulie_haute_corde",
      "dips_banc",
      "kickback_triceps"
    ],
    "antagonists": [
      "curl_pupitre",
      "curl_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_couche_barre",
      "developpe_epaules_machine"
    ],
    "instructions": "Coudes fixes le long du corps. Permet de charger plus qu'à la corde.",
    "instructionsEn": "Elbows fixed along your body. Lets you load heavier than with the rope.",
    "isCustom": false
  },
  {
    "id": "barre_front",
    "name": "Barre au front",
    "nameEn": "Skull crushers",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "barbell",
    "machineType": "Barre EZ, banc plat",
    "machineTypeEn": "EZ bar, flat bench",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "extension_dessus_tete",
      "extension_poulie_haute_corde",
      "dips_banc",
      "kickback_triceps"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_militaire"
    ],
    "instructions": "Coudes pointés vers le plafond, descends la barre vers le front en gardant les coudes fixes.",
    "instructionsEn": "Elbows pointing to the ceiling, lower the bar toward your forehead keeping your elbows fixed.",
    "isCustom": false
  },
  {
    "id": "extension_dessus_tete",
    "name": "Extension triceps au-dessus de la tête",
    "nameEn": "Overhead triceps extension",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "dumbbell",
    "machineType": "Haltère tenu à deux mains",
    "machineTypeEn": "Dumbbell held with both hands",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_poulie_haute_corde",
      "dips_banc",
      "kickback_triceps"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_militaire"
    ],
    "instructions": "Coudes serrés près des oreilles. Cible la longue portion du triceps.",
    "instructionsEn": "Elbows close to your ears. Targets the long head of the triceps.",
    "isCustom": false
  },
  {
    "id": "extension_poulie_haute_corde",
    "name": "Extension au-dessus de la tête à la poulie",
    "nameEn": "Cable overhead triceps extension",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "cable",
    "machineType": "Poulie basse ou haute avec corde",
    "machineTypeEn": "Low or high pulley with rope",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete",
      "dips_banc",
      "kickback_triceps"
    ],
    "antagonists": [
      "curl_pupitre",
      "curl_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_couche_barre",
      "developpe_epaules_machine"
    ],
    "instructions": "Dos ou face à la poulie, coudes fixes, étends les bras au-dessus de la tête.",
    "instructionsEn": "Facing toward or away from the pulley, elbows fixed, extend your arms overhead.",
    "isCustom": false
  },
  {
    "id": "dips_banc",
    "name": "Dips sur banc",
    "nameEn": "Bench dips",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "bodyweight",
    "machineType": "Banc plat ou chaise",
    "machineTypeEn": "Flat bench or chair",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "chest",
      "shoulders"
    ],
    "alternatives": [
      "pompes_diamant",
      "developpe_couche_serre",
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "pompes",
      "dips",
      "developpe_militaire"
    ],
    "instructions": "Mains derrière toi sur le banc, descends en pliant les coudes vers l'arrière.",
    "instructionsEn": "Hands behind you on the bench, lower by bending your elbows backward.",
    "isCustom": false
  },
  {
    "id": "kickback_triceps",
    "name": "Kickback triceps",
    "nameEn": "Triceps kickback",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "dumbbell",
    "machineType": "Haltère léger, buste penché",
    "machineTypeEn": "Light dumbbell, bent over",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete",
      "extension_poulie_haute_corde",
      "dips_banc"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_militaire"
    ],
    "instructions": "Coude fixe à hauteur du dos, étends l'avant-bras vers l'arrière.",
    "instructionsEn": "Elbow fixed at back level, extend your forearm backward.",
    "isCustom": false
  },
  {
    "id": "developpe_couche_serre",
    "name": "Développé couché prise serrée",
    "nameEn": "Close-grip bench press",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "barbell",
    "machineType": "Banc plat, barre olympique",
    "machineTypeEn": "Flat bench, Olympic barbell",
    "primaryMuscles": [
      "triceps",
      "chest"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "dips_banc",
      "pompes_diamant",
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "developpe_couche_barre",
      "developpe_couche_halteres",
      "developpe_militaire"
    ],
    "instructions": "Mains à largeur d'épaules, coudes proches du buste. Permet de charger lourd sur les triceps.",
    "instructionsEn": "Hands shoulder-width apart, elbows close to your torso. Lets you load heavy on the triceps.",
    "isCustom": false
  },
  {
    "id": "machine_triceps",
    "name": "Extension triceps à la machine",
    "nameEn": "Machine triceps extension",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "machine",
    "machineType": "Machine triceps assise (extension ou dips)",
    "machineTypeEn": "Seated triceps machine (extension or dip)",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete",
      "extension_poulie_haute_corde",
      "dips_banc"
    ],
    "antagonists": [
      "curl_pupitre",
      "curl_poulie"
    ],
    "complements": [
      "developpe_machine",
      "developpe_couche_barre",
      "developpe_epaules_machine"
    ],
    "instructions": "Bras calés, étends complètement sans hyperextension.",
    "instructionsEn": "Arms supported, extend fully without hyperextending.",
    "isCustom": false
  },
  {
    "id": "pompes_diamant",
    "name": "Pompes diamant",
    "nameEn": "Diamond push-ups",
    "group": "arms",
    "movementPattern": "tri",
    "equipmentType": "bodyweight",
    "machineType": "Au sol, mains rapprochées en diamant",
    "machineTypeEn": "On the floor, hands close together in a diamond",
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "chest",
      "shoulders"
    ],
    "alternatives": [
      "dips_banc",
      "developpe_couche_serre",
      "extension_triceps_poulie",
      "extension_triceps_barre",
      "barre_front",
      "extension_dessus_tete"
    ],
    "antagonists": [
      "curl_barre",
      "curl_halteres"
    ],
    "complements": [
      "pompes",
      "dips",
      "developpe_militaire"
    ],
    "instructions": "Mains sous la poitrine, coudes serrés. Variante exigeante pour les triceps.",
    "instructionsEn": "Hands under your chest, elbows tight. A demanding triceps variation.",
    "isCustom": false
  },
  {
    "id": "curl_poignets",
    "name": "Curl poignets",
    "nameEn": "Wrist curls",
    "group": "arms",
    "movementPattern": "forearm",
    "equipmentType": "dumbbell",
    "machineType": "Barre ou haltères, avant-bras posés sur un banc",
    "machineTypeEn": "Barbell or dumbbells, forearms resting on a bench",
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "curl_inverse",
      "farmer_walk",
      "curl_marteau"
    ],
    "antagonists": [],
    "complements": [
      "curl_barre",
      "curl_halteres",
      "rowing_barre"
    ],
    "instructions": "Avant-bras calés, laisse rouler la charge jusqu'au bout des doigts puis remonte.",
    "instructionsEn": "Forearms supported, let the weight roll down to your fingertips, then curl back up.",
    "isCustom": false
  },
  {
    "id": "farmer_walk",
    "name": "Marche du fermier",
    "nameEn": "Farmer's walk",
    "group": "arms",
    "movementPattern": "forearm",
    "equipmentType": "dumbbell",
    "machineType": "Haltères lourds ou kettlebells",
    "machineTypeEn": "Heavy dumbbells or kettlebells",
    "primaryMuscles": [
      "forearms",
      "traps"
    ],
    "secondaryMuscles": [
      "abs",
      "glutes"
    ],
    "alternatives": [
      "curl_inverse",
      "curl_poignets",
      "curl_marteau",
      "shrugs"
    ],
    "antagonists": [],
    "complements": [
      "curl_barre",
      "curl_halteres",
      "rowing_barre"
    ],
    "instructions": "Marche gainé avec une charge lourde dans chaque main, épaules basses.",
    "instructionsEn": "Walk braced with a heavy weight in each hand, shoulders down.",
    "isCustom": false
  },
  {
    "id": "squat_barre",
    "name": "Squat barre",
    "nameEn": "Barbell squat",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "barbell",
    "machineType": "Rack à squat, barre olympique",
    "machineTypeEn": "Squat rack, Olympic barbell",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "lower_back",
      "abs",
      "adductors"
    ],
    "alternatives": [
      "squat_smith",
      "goblet_squat",
      "presse_cuisses",
      "squat_avant",
      "hack_squat",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust",
      "crunch"
    ],
    "instructions": "Barre sur les trapèzes, genoux dans l'axe des pieds. Descends jusqu'à la parallèle ou plus bas.",
    "instructionsEn": "Bar on your traps, knees in line with your feet. Descend to parallel or lower.",
    "isCustom": false
  },
  {
    "id": "squat_avant",
    "name": "Squat avant (front squat)",
    "nameEn": "Front squat",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "barbell",
    "machineType": "Rack à squat, barre sur les deltoïdes avant",
    "machineTypeEn": "Squat rack, barbell on the front delts",
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "abs",
      "lower_back"
    ],
    "alternatives": [
      "squat_barre",
      "goblet_squat",
      "hack_squat",
      "squat_smith",
      "presse_cuisses",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust",
      "crunch"
    ],
    "instructions": "Coudes hauts, buste vertical. Sollicite davantage les quadriceps et les abdos.",
    "instructionsEn": "Elbows high, torso upright. Works the quads and abs harder.",
    "isCustom": false
  },
  {
    "id": "squat_smith",
    "name": "Squat à la Smith machine",
    "nameEn": "Smith machine squat",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "machine",
    "machineType": "Smith machine (barre guidée)",
    "machineTypeEn": "Smith machine (guided bar)",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "adductors"
    ],
    "alternatives": [
      "squat_barre",
      "presse_cuisses",
      "goblet_squat",
      "hack_squat",
      "squat_avant",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "kickback_poulie",
      "crunch_poulie"
    ],
    "instructions": "Place les pieds légèrement devant la barre. Trajectoire guidée, moins de gainage requis.",
    "instructionsEn": "Place your feet slightly in front of the bar. Guided path, less stabilization required.",
    "isCustom": false
  },
  {
    "id": "goblet_squat",
    "name": "Goblet squat",
    "nameEn": "Goblet squat",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "dumbbell",
    "machineType": "Un haltère ou un kettlebell tenu contre la poitrine",
    "machineTypeEn": "One dumbbell or kettlebell held against your chest",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "abs",
      "adductors"
    ],
    "alternatives": [
      "squat_barre",
      "squat_smith",
      "presse_cuisses",
      "squat_avant",
      "hack_squat",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust",
      "crunch"
    ],
    "instructions": "Coudes entre les genoux en bas, buste droit. Excellent pour apprendre le squat.",
    "instructionsEn": "Elbows between your knees at the bottom, torso upright. Great for learning the squat.",
    "isCustom": false
  },
  {
    "id": "presse_cuisses",
    "name": "Presse à cuisses",
    "nameEn": "Leg press",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "machine",
    "machineType": "Presse inclinée à 45° ou horizontale",
    "machineTypeEn": "45° incline or horizontal leg press",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "adductors",
      "calves"
    ],
    "alternatives": [
      "squat_barre",
      "squat_smith",
      "goblet_squat",
      "hack_squat",
      "squat_avant",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "kickback_poulie",
      "crunch_poulie"
    ],
    "instructions": "Pieds à largeur d'épaules, dos et fessiers plaqués. Ne verrouille pas les genoux.",
    "instructionsEn": "Feet shoulder-width apart, back and glutes flat against the pad. Do not lock out your knees.",
    "isCustom": false
  },
  {
    "id": "hack_squat",
    "name": "Hack squat",
    "nameEn": "Hack squat",
    "group": "legs",
    "movementPattern": "squat",
    "equipmentType": "machine",
    "machineType": "Machine hack squat",
    "machineTypeEn": "Hack squat machine",
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "adductors"
    ],
    "alternatives": [
      "squat_barre",
      "squat_avant",
      "squat_smith",
      "goblet_squat",
      "presse_cuisses",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge",
      "souleve_de_terre"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "kickback_poulie",
      "crunch_poulie"
    ],
    "instructions": "Dos calé contre le dossier, pieds légèrement devant. Descends jusqu'à 90° ou plus.",
    "instructionsEn": "Back against the backrest, feet slightly forward. Descend to 90° or deeper.",
    "isCustom": false
  },
  {
    "id": "fentes_marchees",
    "name": "Fentes marchées",
    "nameEn": "Walking lunges",
    "group": "legs",
    "movementPattern": "lunge",
    "equipmentType": "dumbbell",
    "machineType": "Haltères, espace pour marcher",
    "machineTypeEn": "Dumbbells, space to walk",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "adductors",
      "abs"
    ],
    "alternatives": [
      "fentes_arriere",
      "fentes_bulgares",
      "step_up",
      "squat_barre",
      "squat_smith",
      "goblet_squat"
    ],
    "antagonists": [
      "souleve_de_terre",
      "rdl",
      "leg_curl_assis"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust"
    ],
    "instructions": "Pas long, genou avant dans l'axe du pied. Buste droit.",
    "instructionsEn": "Long stride, front knee in line with your foot. Torso upright.",
    "isCustom": false
  },
  {
    "id": "fentes_arriere",
    "name": "Fentes arrière",
    "nameEn": "Reverse lunges",
    "group": "legs",
    "movementPattern": "lunge",
    "equipmentType": "dumbbell",
    "machineType": "Haltères ou barre, espace au sol",
    "machineTypeEn": "Dumbbells or barbell, floor space",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "adductors"
    ],
    "alternatives": [
      "fentes_marchees",
      "fentes_bulgares",
      "step_up",
      "squat_barre",
      "squat_smith",
      "presse_cuisses"
    ],
    "antagonists": [
      "souleve_de_terre",
      "rdl",
      "leg_curl_assis"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust"
    ],
    "instructions": "Recule d'un pas, le genou arrière frôle le sol. Plus doux pour les genoux que les fentes avant.",
    "instructionsEn": "Step back, back knee just above the floor. Easier on the knees than forward lunges.",
    "isCustom": false
  },
  {
    "id": "fentes_bulgares",
    "name": "Split squat bulgare",
    "nameEn": "Bulgarian split squat",
    "group": "legs",
    "movementPattern": "lunge",
    "equipmentType": "dumbbell",
    "machineType": "Banc derrière soi et haltères",
    "machineTypeEn": "Bench behind you and dumbbells",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "adductors"
    ],
    "alternatives": [
      "fentes_marchees",
      "fentes_arriere",
      "step_up",
      "squat_barre",
      "squat_smith",
      "presse_cuisses"
    ],
    "antagonists": [
      "souleve_de_terre",
      "rdl",
      "leg_curl_assis"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust"
    ],
    "instructions": "Pied arrière posé sur le banc. Descends verticalement, poids sur la jambe avant.",
    "instructionsEn": "Rear foot on the bench. Descend vertically, weight on the front leg.",
    "isCustom": false
  },
  {
    "id": "step_up",
    "name": "Step-up",
    "nameEn": "Step-up",
    "group": "legs",
    "movementPattern": "lunge",
    "equipmentType": "dumbbell",
    "machineType": "Banc ou box, haltères",
    "machineTypeEn": "Bench or box, dumbbells",
    "primaryMuscles": [
      "quads",
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "calves"
    ],
    "alternatives": [
      "fentes_marchees",
      "fentes_arriere",
      "fentes_bulgares",
      "presse_cuisses",
      "squat_barre",
      "squat_smith"
    ],
    "antagonists": [
      "souleve_de_terre",
      "rdl",
      "leg_curl_assis"
    ],
    "complements": [
      "mollets_debout",
      "mollets_assis",
      "hip_thrust"
    ],
    "instructions": "Pousse avec la jambe avant sans t'aider de l'autre. Contrôle la descente.",
    "instructionsEn": "Drive through the front leg without pushing off with the other. Control the descent.",
    "isCustom": false
  },
  {
    "id": "leg_extension",
    "name": "Leg extension",
    "nameEn": "Leg extension",
    "group": "legs",
    "movementPattern": "lext",
    "equipmentType": "machine",
    "machineType": "Machine à quadriceps (leg extension)",
    "machineTypeEn": "Leg extension machine (quads)",
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "squat_barre",
      "squat_avant",
      "squat_smith",
      "goblet_squat",
      "presse_cuisses",
      "hack_squat"
    ],
    "antagonists": [
      "leg_curl_assis",
      "leg_curl_allonge"
    ],
    "complements": [
      "souleve_de_terre",
      "rdl",
      "mollets_debout"
    ],
    "instructions": "Dos calé, axe du genou aligné avec l'axe de la machine. Marque une pause en haut.",
    "instructionsEn": "Back supported, knee axis aligned with the machine axis. Pause at the top.",
    "isCustom": false
  },
  {
    "id": "leg_curl_assis",
    "name": "Leg curl assis",
    "nameEn": "Seated leg curl",
    "group": "legs",
    "movementPattern": "lcurl",
    "equipmentType": "machine",
    "machineType": "Machine leg curl assise",
    "machineTypeEn": "Seated leg curl machine",
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "calves"
    ],
    "alternatives": [
      "leg_curl_allonge",
      "rdl",
      "good_morning",
      "souleve_de_terre"
    ],
    "antagonists": [
      "leg_extension",
      "squat_smith"
    ],
    "complements": [
      "kickback_poulie",
      "hip_thrust",
      "mollets_debout"
    ],
    "instructions": "Cuisses bien calées. Plie les genoux en gardant le bassin plaqué.",
    "instructionsEn": "Thighs well secured. Bend your knees while keeping your hips pressed down.",
    "isCustom": false
  },
  {
    "id": "leg_curl_allonge",
    "name": "Leg curl allongé",
    "nameEn": "Lying leg curl",
    "group": "legs",
    "movementPattern": "lcurl",
    "equipmentType": "machine",
    "machineType": "Machine leg curl allongée",
    "machineTypeEn": "Lying leg curl machine",
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "calves",
      "glutes"
    ],
    "alternatives": [
      "leg_curl_assis",
      "good_morning",
      "rdl",
      "souleve_de_terre"
    ],
    "antagonists": [
      "leg_extension",
      "squat_smith"
    ],
    "complements": [
      "kickback_poulie",
      "hip_thrust",
      "mollets_debout"
    ],
    "instructions": "Bassin plaqué au banc, sans te cambrer. Ramène les talons vers les fessiers.",
    "instructionsEn": "Hips flat on the bench, no arching. Bring your heels toward your glutes.",
    "isCustom": false
  },
  {
    "id": "rdl",
    "name": "Soulevé de terre roumain",
    "nameEn": "Romanian deadlift",
    "group": "legs",
    "movementPattern": "hinge",
    "equipmentType": "barbell",
    "machineType": "Barre olympique ou haltères",
    "machineTypeEn": "Olympic barbell or dumbbells",
    "primaryMuscles": [
      "hamstrings",
      "glutes"
    ],
    "secondaryMuscles": [
      "lower_back",
      "forearms",
      "traps"
    ],
    "alternatives": [
      "souleve_de_terre",
      "good_morning",
      "squat_barre",
      "squat_smith",
      "goblet_squat",
      "presse_cuisses"
    ],
    "antagonists": [
      "leg_extension",
      "squat_avant"
    ],
    "complements": [
      "hip_thrust",
      "pont_fessier",
      "extension_lombaires",
      "crunch"
    ],
    "instructions": "Jambes presque tendues, bassin en arrière, dos plat. Descends jusqu'à sentir l'étirement des ischios.",
    "instructionsEn": "Legs almost straight, hips back, back flat. Lower until you feel the hamstrings stretch.",
    "isCustom": false
  },
  {
    "id": "good_morning",
    "name": "Good morning",
    "nameEn": "Good morning",
    "group": "legs",
    "movementPattern": "hinge",
    "equipmentType": "barbell",
    "machineType": "Barre sur les trapèzes (rack)",
    "machineTypeEn": "Barbell on the traps (rack)",
    "primaryMuscles": [
      "hamstrings",
      "lower_back"
    ],
    "secondaryMuscles": [
      "glutes"
    ],
    "alternatives": [
      "souleve_de_terre",
      "rdl",
      "leg_curl_allonge",
      "extension_lombaires",
      "leg_curl_assis"
    ],
    "antagonists": [
      "leg_extension",
      "squat_barre"
    ],
    "complements": [
      "hip_thrust",
      "pont_fessier",
      "crunch"
    ],
    "instructions": "Charge modérée, dos plat, penche le buste en poussant le bassin en arrière.",
    "instructionsEn": "Moderate weight, flat back, hinge forward while pushing your hips back.",
    "isCustom": false
  },
  {
    "id": "hip_thrust",
    "name": "Hip thrust",
    "nameEn": "Hip thrust",
    "group": "legs",
    "movementPattern": "hip",
    "equipmentType": "barbell",
    "machineType": "Banc, barre avec coussin de protection (ou machine hip thrust)",
    "machineTypeEn": "Bench, barbell with a protective pad (or hip thrust machine)",
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "quads",
      "adductors"
    ],
    "alternatives": [
      "pont_fessier",
      "kickback_poulie",
      "squat_barre",
      "squat_smith",
      "presse_cuisses",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_extension"
    ],
    "complements": [
      "squat_avant",
      "goblet_squat",
      "leg_curl_assis",
      "abduction_machine"
    ],
    "instructions": "Haut du dos calé sur le banc, menton rentré. Pousse fort les hanches et serre les fessiers en haut.",
    "instructionsEn": "Upper back on the bench, chin tucked. Drive your hips up hard and squeeze the glutes at the top.",
    "isCustom": false
  },
  {
    "id": "pont_fessier",
    "name": "Pont fessier",
    "nameEn": "Glute bridge",
    "group": "legs",
    "movementPattern": "hip",
    "equipmentType": "bodyweight",
    "machineType": "Au sol, poids du corps (ou barre)",
    "machineTypeEn": "On the floor, bodyweight (or barbell)",
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings"
    ],
    "alternatives": [
      "hip_thrust",
      "kickback_poulie",
      "squat_barre",
      "squat_smith",
      "presse_cuisses",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_extension"
    ],
    "complements": [
      "squat_avant",
      "goblet_squat",
      "leg_curl_assis",
      "abduction_machine"
    ],
    "instructions": "Talons près des fessiers, monte le bassin et serre les fessiers en haut.",
    "instructionsEn": "Heels close to your glutes, lift your hips and squeeze the glutes at the top.",
    "isCustom": false
  },
  {
    "id": "kickback_poulie",
    "name": "Kickback fessier à la poulie",
    "nameEn": "Cable glute kickback",
    "group": "legs",
    "movementPattern": "hip",
    "equipmentType": "cable",
    "machineType": "Poulie basse avec sangle de cheville",
    "machineTypeEn": "Low pulley with an ankle strap",
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings"
    ],
    "alternatives": [
      "hip_thrust",
      "pont_fessier",
      "squat_barre",
      "squat_smith",
      "presse_cuisses",
      "fentes_marchees"
    ],
    "antagonists": [
      "leg_extension"
    ],
    "complements": [
      "hack_squat",
      "squat_avant",
      "leg_curl_assis",
      "abduction_machine"
    ],
    "instructions": "Poussée jambe tendue vers l'arrière, sans te cambrer.",
    "instructionsEn": "Push your straight leg backward without arching your back.",
    "isCustom": false
  },
  {
    "id": "abduction_machine",
    "name": "Abduction à la machine",
    "nameEn": "Hip abduction machine",
    "group": "legs",
    "movementPattern": "abd",
    "equipmentType": "machine",
    "machineType": "Machine abducteurs (assise)",
    "machineTypeEn": "Seated abductor machine",
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "squat_barre",
      "squat_smith",
      "goblet_squat",
      "presse_cuisses",
      "fentes_marchees",
      "fentes_arriere"
    ],
    "antagonists": [],
    "complements": [
      "kickback_poulie",
      "hip_thrust",
      "hack_squat"
    ],
    "instructions": "Ouvre les cuisses avec contrôle. Penche légèrement le buste pour cibler les fessiers.",
    "instructionsEn": "Open your thighs with control. Lean your torso slightly forward to target the glutes.",
    "isCustom": false
  },
  {
    "id": "adduction_machine",
    "name": "Adduction à la machine",
    "nameEn": "Hip adduction machine",
    "group": "legs",
    "movementPattern": "abd",
    "equipmentType": "machine",
    "machineType": "Machine adducteurs (assise)",
    "machineTypeEn": "Seated adductor machine",
    "primaryMuscles": [
      "adductors"
    ],
    "secondaryMuscles": [],
    "alternatives": [],
    "antagonists": [],
    "complements": [
      "kickback_poulie",
      "hip_thrust",
      "squat_smith"
    ],
    "instructions": "Referme les cuisses sans à-coups, sur une amplitude confortable.",
    "instructionsEn": "Close your thighs without jerking, over a comfortable range of motion.",
    "isCustom": false
  },
  {
    "id": "mollets_debout",
    "name": "Mollets debout à la machine",
    "nameEn": "Standing calf raise",
    "group": "legs",
    "movementPattern": "calf",
    "equipmentType": "machine",
    "machineType": "Machine à mollets debout (standing calf raise)",
    "machineTypeEn": "Standing calf raise machine",
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "mollets_assis",
      "mollets_presse"
    ],
    "antagonists": [],
    "complements": [
      "squat_smith",
      "presse_cuisses",
      "leg_curl_assis"
    ],
    "instructions": "Monte sur la pointe des pieds, pause en haut, descends bien jusqu'à l'étirement.",
    "instructionsEn": "Rise onto your toes, pause at the top, and lower all the way to the stretch.",
    "isCustom": false
  },
  {
    "id": "mollets_assis",
    "name": "Mollets assis",
    "nameEn": "Seated calf raise",
    "group": "legs",
    "movementPattern": "calf",
    "equipmentType": "machine",
    "machineType": "Machine à mollets assis (soléaire)",
    "machineTypeEn": "Seated calf raise machine (soleus)",
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "mollets_debout",
      "mollets_presse"
    ],
    "antagonists": [],
    "complements": [
      "squat_smith",
      "presse_cuisses",
      "leg_curl_assis"
    ],
    "instructions": "Genoux fléchis : cible le soléaire. Amplitude complète.",
    "instructionsEn": "Knees bent: targets the soleus. Full range of motion.",
    "isCustom": false
  },
  {
    "id": "mollets_presse",
    "name": "Mollets à la presse",
    "nameEn": "Leg press calf raise",
    "group": "legs",
    "movementPattern": "calf",
    "equipmentType": "machine",
    "machineType": "Presse à cuisses (avant-pieds en bas du plateau)",
    "machineTypeEn": "Leg press (balls of the feet at the bottom of the platform)",
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "alternatives": [
      "mollets_debout",
      "mollets_assis"
    ],
    "antagonists": [],
    "complements": [
      "squat_smith",
      "presse_cuisses",
      "leg_curl_assis"
    ],
    "instructions": "Jambes tendues, pousse uniquement sur les avant-pieds.",
    "instructionsEn": "Legs straight, push only through the balls of your feet.",
    "isCustom": false
  },
  {
    "id": "crunch",
    "name": "Crunch au sol",
    "nameEn": "Floor crunch",
    "group": "abs",
    "movementPattern": "coreflex",
    "equipmentType": "bodyweight",
    "machineType": "Tapis de sol",
    "machineTypeEn": "Exercise mat",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "obliques"
    ],
    "alternatives": [
      "crunch_poulie",
      "crunch_machine",
      "releve_jambes_suspendu",
      "releve_jambes_banc",
      "gainage",
      "roue_abdos"
    ],
    "antagonists": [
      "extension_lombaires"
    ],
    "complements": [
      "russian_twist",
      "woodchopper",
      "gainage_lateral"
    ],
    "instructions": "Enroule les épaules vers le bassin, lombaires plaquées. Ne tire pas sur la nuque.",
    "instructionsEn": "Curl your shoulders toward your pelvis, lower back pressed down. Do not pull on your neck.",
    "isCustom": false
  },
  {
    "id": "crunch_poulie",
    "name": "Crunch à la poulie haute",
    "nameEn": "Cable crunch",
    "group": "abs",
    "movementPattern": "coreflex",
    "equipmentType": "cable",
    "machineType": "Poulie haute avec corde, à genoux",
    "machineTypeEn": "High pulley with rope, kneeling",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "obliques"
    ],
    "alternatives": [
      "crunch",
      "crunch_machine",
      "releve_jambes_suspendu",
      "releve_jambes_banc",
      "gainage",
      "roue_abdos"
    ],
    "antagonists": [
      "extension_lombaires"
    ],
    "complements": [
      "woodchopper",
      "pallof_press",
      "gainage_lateral"
    ],
    "instructions": "Enroule le buste en rapprochant les coudes des genoux, bassin fixe.",
    "instructionsEn": "Curl your torso by bringing your elbows toward your knees, hips fixed.",
    "isCustom": false
  },
  {
    "id": "crunch_machine",
    "name": "Crunch à la machine",
    "nameEn": "Machine crunch",
    "group": "abs",
    "movementPattern": "coreflex",
    "equipmentType": "machine",
    "machineType": "Machine à abdominaux assise",
    "machineTypeEn": "Seated ab machine",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "obliques"
    ],
    "alternatives": [
      "crunch",
      "crunch_poulie",
      "releve_jambes_suspendu",
      "releve_jambes_banc",
      "gainage",
      "roue_abdos"
    ],
    "antagonists": [
      "extension_lombaires"
    ],
    "complements": [
      "woodchopper",
      "pallof_press",
      "gainage_lateral"
    ],
    "instructions": "Enroule le buste sans pousser avec les bras. Contrôle le retour.",
    "instructionsEn": "Curl your torso without pushing with your arms. Control the return.",
    "isCustom": false
  },
  {
    "id": "releve_jambes_suspendu",
    "name": "Relevé de jambes suspendu",
    "nameEn": "Hanging leg raise",
    "group": "abs",
    "movementPattern": "coreflex",
    "equipmentType": "bodyweight",
    "machineType": "Barre fixe ou chaise romaine (captain's chair)",
    "machineTypeEn": "Pull-up bar or captain's chair",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "forearms",
      "obliques"
    ],
    "alternatives": [
      "crunch",
      "crunch_poulie",
      "crunch_machine",
      "releve_jambes_banc",
      "gainage",
      "roue_abdos"
    ],
    "antagonists": [
      "extension_lombaires"
    ],
    "complements": [
      "russian_twist",
      "woodchopper",
      "gainage_lateral"
    ],
    "instructions": "Bascule le bassin en montant les jambes pour solliciter les abdos plutôt que les fléchisseurs de hanche.",
    "instructionsEn": "Tilt your pelvis as you raise your legs to work the abs rather than the hip flexors.",
    "isCustom": false
  },
  {
    "id": "releve_jambes_banc",
    "name": "Relevé de jambes au banc",
    "nameEn": "Lying leg raise",
    "group": "abs",
    "movementPattern": "coreflex",
    "equipmentType": "bodyweight",
    "machineType": "Banc plat",
    "machineTypeEn": "Flat bench",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "obliques"
    ],
    "alternatives": [
      "crunch",
      "crunch_poulie",
      "crunch_machine",
      "releve_jambes_suspendu",
      "gainage",
      "roue_abdos"
    ],
    "antagonists": [
      "extension_lombaires"
    ],
    "complements": [
      "russian_twist",
      "woodchopper",
      "gainage_lateral"
    ],
    "instructions": "Allongé, monte les jambes en décollant légèrement le bassin. Plus accessible que suspendu.",
    "instructionsEn": "Lying down, raise your legs while lifting your pelvis slightly. More accessible than hanging.",
    "isCustom": false
  },
  {
    "id": "roue_abdos",
    "name": "Roue abdominale",
    "nameEn": "Ab wheel rollout",
    "group": "abs",
    "movementPattern": "corestab",
    "equipmentType": "bodyweight",
    "machineType": "Roue abdominale (ab wheel)",
    "machineTypeEn": "Ab wheel",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "shoulders",
      "lats",
      "lower_back"
    ],
    "alternatives": [
      "gainage",
      "pallof_press",
      "crunch",
      "crunch_poulie",
      "crunch_machine",
      "releve_jambes_suspendu"
    ],
    "antagonists": [],
    "complements": [
      "releve_jambes_banc",
      "extension_lombaires"
    ],
    "instructions": "À genoux, roule aussi loin que tu peux garder le dos plat. Exigeant.",
    "instructionsEn": "On your knees, roll out as far as you can keep your back flat. Demanding.",
    "isCustom": false
  },
  {
    "id": "gainage",
    "name": "Planche (gainage)",
    "nameEn": "Plank",
    "group": "abs",
    "movementPattern": "corestab",
    "equipmentType": "bodyweight",
    "machineType": "Tapis de sol",
    "machineTypeEn": "Exercise mat",
    "primaryMuscles": [
      "abs"
    ],
    "secondaryMuscles": [
      "obliques",
      "lower_back",
      "shoulders",
      "glutes"
    ],
    "alternatives": [
      "roue_abdos",
      "crunch",
      "crunch_poulie",
      "crunch_machine",
      "releve_jambes_suspendu",
      "releve_jambes_banc"
    ],
    "antagonists": [],
    "complements": [
      "extension_lombaires"
    ],
    "instructions": "Coudes sous les épaules, corps aligné. Serre fessiers et abdos.",
    "instructionsEn": "Elbows under your shoulders, body aligned. Squeeze glutes and abs.",
    "isCustom": false
  },
  {
    "id": "gainage_lateral",
    "name": "Gainage latéral",
    "nameEn": "Side plank",
    "group": "abs",
    "movementPattern": "corestab",
    "equipmentType": "bodyweight",
    "machineType": "Tapis de sol",
    "machineTypeEn": "Exercise mat",
    "primaryMuscles": [
      "obliques"
    ],
    "secondaryMuscles": [
      "abs",
      "glutes",
      "shoulders"
    ],
    "alternatives": [
      "woodchopper",
      "russian_twist",
      "pallof_press"
    ],
    "antagonists": [],
    "complements": [
      "crunch",
      "releve_jambes_suspendu",
      "extension_lombaires"
    ],
    "instructions": "Sur un coude, corps droit. Cible les obliques et le moyen fessier.",
    "instructionsEn": "On one elbow, body straight. Targets the obliques and gluteus medius.",
    "isCustom": false
  },
  {
    "id": "russian_twist",
    "name": "Russian twist",
    "nameEn": "Russian twist",
    "group": "abs",
    "movementPattern": "corerot",
    "equipmentType": "bodyweight",
    "machineType": "Tapis, disque ou medecine ball",
    "machineTypeEn": "Mat, plate or medicine ball",
    "primaryMuscles": [
      "obliques"
    ],
    "secondaryMuscles": [
      "abs"
    ],
    "alternatives": [
      "woodchopper",
      "pallof_press",
      "gainage_lateral"
    ],
    "antagonists": [],
    "complements": [
      "crunch",
      "releve_jambes_suspendu",
      "extension_lombaires"
    ],
    "instructions": "Buste incliné en arrière, pieds au sol ou décollés. Tourne le buste, pas seulement les bras.",
    "instructionsEn": "Torso leaning back, feet on the floor or lifted. Rotate your torso, not just your arms.",
    "isCustom": false
  },
  {
    "id": "woodchopper",
    "name": "Woodchopper à la poulie",
    "nameEn": "Cable woodchopper",
    "group": "abs",
    "movementPattern": "corerot",
    "equipmentType": "cable",
    "machineType": "Poulie haute ou basse avec poignée",
    "machineTypeEn": "High or low pulley with a handle",
    "primaryMuscles": [
      "obliques"
    ],
    "secondaryMuscles": [
      "abs",
      "shoulders"
    ],
    "alternatives": [
      "russian_twist",
      "pallof_press",
      "gainage_lateral"
    ],
    "antagonists": [],
    "complements": [
      "crunch_poulie",
      "crunch_machine",
      "extension_lombaires"
    ],
    "instructions": "Pivote le buste en tirant en diagonale. Hanches stables.",
    "instructionsEn": "Pivot your torso while pulling diagonally. Hips stable.",
    "isCustom": false
  },
  {
    "id": "pallof_press",
    "name": "Pallof press",
    "nameEn": "Pallof press",
    "group": "abs",
    "movementPattern": "corerot",
    "equipmentType": "cable",
    "machineType": "Poulie à hauteur de poitrine",
    "machineTypeEn": "Pulley at chest height",
    "primaryMuscles": [
      "obliques",
      "abs"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "alternatives": [
      "woodchopper",
      "russian_twist",
      "roue_abdos",
      "gainage",
      "gainage_lateral",
      "crunch"
    ],
    "antagonists": [],
    "complements": [
      "crunch_poulie",
      "crunch_machine",
      "extension_lombaires"
    ],
    "instructions": "Résiste à la rotation en poussant la poignée devant toi (anti-rotation).",
    "instructionsEn": "Resist rotation by pressing the handle out in front of you (anti-rotation).",
    "isCustom": false
  }
]
