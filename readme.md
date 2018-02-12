#h1 Ninja Kill zombies

The only outside library that I used to create this game is Jquery.  Other than that the game is constructed almost entirely within HTML5's canvas element.

I knew from the start that I wanted to construct a side scrolling Canvas game.  The challenges I ran into were creating the systems for each element of the game.  These elements basically comprise the entire game:
- movement - gravity, friction, and Velocity
- animation - using sprite sheets to create different animations for all characters
- Randomly generated Environment - having the system being able to create a infinite level for the player to play in

The first thing I tackled was getting the movement.  This took the most time to figure out, and not necessarily from a programming standpoint.  I read this article https://codepen.io/Tobsta/post/implementing-velocity-acceleration-and-friction-on-a-canvas and started using some of their code, however this walk through did not include gravity.  I then read this article http://codetheory.in/basics-of-implementing-gravity-with-html5-canvas/ and had a better understanding.  After tweaking and making my own mental connections, I got it to a good spot.  

The next system, animation, was the most challenging.  I was able to find free assets from https://www.gameart2d.com/freebies.html for the player characters and the enemies.  Then by studying this video https://www.youtube.com/watch?v=W0e9Z5pmt-I&t=206s I was able to figure out how to make a callable function that I could feed each individual object and indicate its animation.  This took the most time because I am not good at image manipulation.

The last big system to implement was the programmatically generated environment.  This was a lot of trouble to have every thing look good and have all the features I wanted.  Randomly generating pits and platforms became difficult.
