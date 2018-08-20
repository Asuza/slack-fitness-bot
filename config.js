module.exports = {
    bot: {
        username: 'Arnold',
        icon_emoji: ':arnold:'
    },
    minutesBetweenExercises: {
        stretches: 40
    },
    messages: {
        "greeting": "KNOCK-KNOCK. GET READY TO STRETCH IN %d MINUTES!",
        "announcement_start": "Time to stretch, <!here|here>!",
        "announcement_upcoming": "NEXT ANNOUNCEMENT IN %d MINUTES.",
        "exit": "I'LL BE BACK."
    },
    exercises: {
        stretches: [
            // From https://draxe.com/exercise-to-do-at-your-desk/
            ['Rubber Neck', `Sit up tall and drop your right  ear down towards your right shoulder (you don’t have to touch it!) and hold for a few seconds and repeat for the left side.`],
            ['Reach for the Stars', `Interlace your fingers and reach up towards the sky, as high as you can … keeping your palms facing up towards the ceiling.`],
            ['Look Around', `Turn your head the left and try and look over your shoulder and hold for a few seconds … repeat on the right.`],
            ['Bobblehead', `Drop your chin down towards your chest and GENTLY roll your head from side to side.`],
            ['Shrugs', `Raise both shoulders up towards your ears and hold for a few seconds and release. Repeat a few times for good measure.`],
            ['Chest Opener', `Bring your hands behind your back, press your palms together, sit up tall and hold for 5–10 seconds.`],
            ['Seated Toy Soldier', `Sit up tall and extend your right arm all the way up towards the ceiling. Straighten your left leg out and raise it up as you bring your right arm down and try to touch your left foot. Do 8–10 on each side.`],
            ['Knee Hugger', `With a bent knee, lift your right leg up and grab it with your arms and pull it in as close to your chest as you can. Hold for 5–10 seconds and make sure and do it on the left side, too.`],
            ['Reach and Bend', `Extend your right arm over your head and reach out as far as you can to the left and gently bend over. Hold for a few seconds and do it the other way.`],
            ['Knee Press', `This one stretches out the glutes. With your right ankle on your left knee, gently press against the right knee a few times. Of course, after you’re done with the right side, be sure and give the left side some love, too.`],
            // From other places
            ['Kneeling Reach and Bend', 'Kneel on the floor with your legs together, back straight, and core tight. Extend your left leg to the side, keep it perpendicular to your body. Extend your right arm overhead, rest your left arm on your left leg, and gently bend your torso and right arm to the left side. Hold for 30 seconds. Repeat on the other side.'],
            ['Standing Quadriceps Stretch', 'Hold one foot behind your body with the opposite hand. Pull your foot upwards, and push your knee backward, core tight. Hold, and repeat on the opposite side.'],
            ['Wrist Extension', 'Hold one arm forward, palm facing down. Raise the fingers and palm and the wrist. Grab your fingers with your other hand and pull them back towards your body. Hold and repeat on the other hand.'],
            ['Wrist Flexion', 'Hold one arm forward, palm facing down. Drop the fingers and palm and the wrist. Grab your fingers with your other hand and pull them towards your body. Hold and repeat on the other hand.'],
        ]
    },
    schedule: {
        startHour: 9,
        endHour: 18
    }
};