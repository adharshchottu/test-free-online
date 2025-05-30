<template>
    <section class="w-full flex justify-center bg-bgDark2 relative pt-20 md:pt-24 lg:pt-28">
        <div class="absolute -top-16" id="blog"></div>
        <div class="pb-0 pt-4 bg-bgDark2 max-w-7xl w-full">
            <motion.div :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :viewport="{ once: true }"
                :transition="{ duration: 0.5, delay: 0.2 }">
                <div class="container px-4 mb-20">
                    <div class="max-w-2xl text-center lg:text-left mb-16 mx-auto lg:ml-0 lg:mr-0">
                        <span class="block-subtitle">Discover Our Thoughts</span>
                        <h2 class="mt-6 mb-6 text-4xl lg:text-5xl font-bold font-heading text-primaryText">
                            Fresh Ideas & Insights
                        </h2>
                        <p class="mb-6 text-secondaryText">
                            Stay ahead of the curve with the latest trends and game-changing perspectives.
                        </p>
                    </div>

                    <!-- Adjusted Flexbox layout for better control of blog card sizes -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="(blog, index) in blogData" :key="index"
                            class="p-6 sm:p-8 bg-bgDark3 rounded-3xl hover:bg-bgDark3Hover transition cursor-pointer">
                            <a :href="'/blog/' + blog.link">
                                <img :src="blog.image.src" :alt="blog.title"
                                    class="rounded-3xl mb-6 w-full h-auto object-cover" :aria-label="blog.title" />
                                <h3 class="mb-4 text-2xl font-bold font-heading text-primaryText">{{ blog.title }}</h3>
                                <p class="text-secondaryText leading-loose">{{ blog.subtitle }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
</template>

<script>
import { motion } from "framer-motion";
import testSSEOnline from "../assets/images/blog/test-sse-online.png";
import redisLuaScript from "../assets/images/blog/redis-lua-script-test-online.png";
import lifeTimeCalculator from "../assets/images/thumbnail/life-time-calculator.png";
import typinksPosterGenerator from "../assets/images/thumbnail/typinks-poster-generator.png";
import kroengerPosterGenerator from "../assets/images/thumbnail/kroenger-poster-generator.png";
import prelimsMarksCalculator from "../assets/images/thumbnail/prelims-marks-calculator.png";
import slidePuzzleGame from "../assets/images/thumbnail/slide-puzzle.png";
import sudoku from "../assets/images/thumbnail/sudoku.png";

export default {
    name: "Blog",
    components: { motion },
    data() {
        return {
            blogData: [
                {
                    title: "How to test SSE online",
                    subtitle:
                        "SSE allows a server to send real-time updates to the browser without the browser asking for them",
                    image: testSSEOnline,
                    link: 'how-to-test-sse-online'
                },
                {
                    title: "Comment tester SSE en ligne",
                    subtitle:
                        "SSE permet à un serveur d'envoyer des mises à jour en temps réel au navigateur sans que celui-ci les demande",
                    image: testSSEOnline,
                    link: 'comment-tester-sse-en-ligne'
                },
                {
                    title: "How to test redis lua script online",
                    subtitle:
                        "Lua in Redis allows developers to execute custom, atomic scripts directly on the server for efficient and complex data manipulations.",
                    image: redisLuaScript,
                    link: 'how-to-test-redis-lua-script-online'
                },
                {
                    title: "Comment utiliser le testeur en ligne de script Lua Redis",
                    subtitle:
                        "Lua dans Redis permet aux développeurs d'exécuter des scripts personnalisés et atomiques directement sur le serveur pour des manipulations de données efficaces et complexes.",
                    image: redisLuaScript,
                    link: 'comment-utiliser-le-testeur-en-ligne-de-script-lua-redis'
                },
                {
                    title: "How to use Typinks Poster Generator Online",
                    subtitle:
                        "Create stunning custom posters for special occasions and observance days with our easy-to-use online poster generator tool.",
                    image: typinksPosterGenerator,
                    link: 'how-to-use-typinks-poster-generator-online'
                },
                {
                    title: "Comment utiliser le générateur d'affiches Typinks en ligne",
                    subtitle:
                        "Créez de superbes affiches personnalisées pour des occasions spéciales et des journées d'observance avec notre outil générateur d'affiches en ligne facile à utiliser.",
                    image: typinksPosterGenerator,
                    link: 'comment-utiliser-le-generateur-affiches-typinks-en-ligne'
                },
                {
                    title: "How to use Kroenger Poster Generator Online",
                    subtitle:
                        "Design eco-friendly awareness posters with our Kroenger poster generator. Perfect for environmental campaigns and educational materials.",
                    image: kroengerPosterGenerator,
                    link: 'how-to-use-kroenger-poster-generator-online'
                },
                {
                    title: "Comment utiliser le générateur d'affiches Kroenger en ligne",
                    subtitle:
                        "Concevez des affiches de sensibilisation écologiques avec notre générateur d'affiches Kroenger. Parfait pour les campagnes environnementales et le matériel éducatif.",
                    image: kroengerPosterGenerator,
                    link: 'comment-utiliser-le-generateur-affiches-kroenger-en-ligne'
                },
                {
                    title: "How to use Life Time Calculator Online",
                    subtitle:
                        "Calculate your exact age in years, months, days, hours, and minutes with our precise life time calculator tool.",
                    image: lifeTimeCalculator,
                    link: 'how-to-use-life-time-calculator-online'
                },
                {
                    title: "Comment utiliser le calculateur de temps de vie en ligne",
                    subtitle:
                        "Calculez votre âge exact en années, mois, jours, heures et minutes avec notre outil de calcul de temps de vie précis.",
                    image: lifeTimeCalculator,
                    link: 'comment-utiliser-le-calculateur-temps-vie-en-ligne'
                },
                {
                    title: "How to use Prelims Marks Calculator Online",
                    subtitle:
                        "Calculate your preliminary exam scores with negative marking support. Perfect for competitive exams and academic assessments.",
                    image: prelimsMarksCalculator,
                    link: 'how-to-use-prelims-marks-calculator-online'
                },
                {
                    title: "Comment utiliser le calculateur de notes d'examens préliminaires en ligne",
                    subtitle:
                        "Calculez vos scores d'examens préliminaires avec support de notation négative. Parfait pour les examens compétitifs et les évaluations académiques.",
                    image: prelimsMarksCalculator,
                    link: 'comment-utiliser-le-calculateur-notes-examens-preliminaires-en-ligne'
                },
                {
                    title: "How to play Slide Puzzle Game Online",
                    subtitle:
                        "Enjoy the classic 3x3 sliding puzzle game with custom image upload. Challenge your problem-solving skills with this brain-teasing game.",
                    image: slidePuzzleGame,
                    link: 'how-to-play-slide-puzzle-game-online'
                },
                {
                    title: "Comment jouer au jeu de puzzle coulissant en ligne",
                    subtitle:
                        "Profitez du jeu de puzzle coulissant 3x3 classique avec téléchargement d'image personnalisée. Défiez vos compétences de résolution de problèmes.",
                    image: slidePuzzleGame,
                    link: 'comment-jouer-au-jeu-puzzle-coulissant-en-ligne'
                },
                {
                    title: "How to play Sudoku Online - Free Unlimited Puzzles",
                    subtitle:
                        "Master the classic 9x9 Sudoku puzzle with unlimited free games. Improve your logic and problem-solving skills with this timeless number game.",
                    image: sudoku,
                    link: 'how-to-play-sudoku-online-free-unlimited'
                },
                {
                    title: "Comment jouer au Sudoku en ligne gratuit et illimité",
                    subtitle:
                        "Maîtrisez le puzzle Sudoku 9x9 classique avec des jeux gratuits illimités. Améliorez votre logique et vos compétences de résolution de problèmes.",
                    image: sudoku,
                    link: 'comment-jouer-au-sudoku-en-ligne-gratuit-illimite'
                }
            ],
        };
    },
};
</script>