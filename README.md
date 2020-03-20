# Workshop: Whimsical Animation

Today, we'll build an over-the-top "like" button, similar to the one found on Twitter.com:

![Twitter like button](./__lecture/assets/demo.gif)

While it all happens quickly, there's actually quite a lot going on here! Specifically, we will need 3 distinct animations:

- A pink circle needs to rise up and "pop"
- The heart needs to swell up, in a springy motion
- Confetti particles need to burst out

We'll build them in turn :)

## Starting point

Inside the workshop, you'll find a basic React app that loads the following Tweet:

![Initial view](./__lecture/assets/initial.png)

Take a few moments to investigate the provided folders and files. This project comes with a decent amount of scaffolding. Be sure to check out the various components (and the files within these directories):

- App
- LikeButton
- Tweet
- UnstyledButton

### Component directory structure

This project uses a slightly different directory structure: each component gets its own folder in `src/components`. It looks like this:

.
└── components
└── SomeComponent
├── index.js
└── SomeComponent.js

The `index.js` has this peculiar thing:

```js
export { default } from './SomeComponent';
```

This structure allows for something pretty neat. Consider this snippet from `App.js`:

```js
import Tweet from '../Tweet';
```

This import points to the _directory_, `src/components/Tweet`. When you point an import at a directory, it looks for an `index.js` inside; this is part of how Node.js module resolution works.

The `index.js` is really just a forwarder. It exports the default export from the file with the same name, `Tweet.js`.

Why not just put the code in `index.js`? Because it's annoying to work with dozens of files all named `index.js`:

![too many files named index.js](./__lecture/assets/index.png)

This convoluted structure means that we have nice imports, as well as a clear editing experience. But it does mean that adding new components is kind of a pain.

---

### Exercise 1: Pre-animation work

Before we get to the fun stuff, we have a bit of work to do. It looks like the workshop doesn't quite have all the stuff we'd expect to see in a tweet. Specifically, the following things are missing:

- The date and time of the tweet
- The # of retweets
- The # of likes

Additionally, nothing actually works yet; we can't "like" or "retweet" the tweet!

This workshop is focused entirely on front-end UI stuff, so we don't need to worry about "real" data, but we do need to make sure that are components are well-architected.

For the date and time, you can create a Date object:

```js
const date = new Date();
```

To format it nicely, check out the date-fns library: https://date-fns.org/v2.10.0/docs/format

We need to know the # of likes, # of retweets. We also need to know if the current user has liked and/or retweeted the tweet. We'll need to make use of _useReducer_. The state of this reducer should look something like this:

```json
{
  "numOfLikes": 100,
  "numOfRetweets": 100,
  "isLiked": false,
  "isRetweeted": false
}
```

This state can be used to power the props, which should look something like this:

```js
<Tweet
  tweetContents="Where in the world am I?"
  displayName="Carmen Sandiego ✨"
  username="carmen-sandiego"
  avatarSrc={avatar}
  timestamp={date}
  // The following 3 values are driven by React state hooks:
  numOfRetweets={state.numOfRetweets}
  numOfLikes={state.numOfLikes}
  isLikedByCurrentUser={state.isLiked}
  isRetweetedByCurrentUser={state.isRetweeted}
  // The following 2 values should dispatch an action to change the state:
  handleToggleLike={toggleLike}
  handleToggleRetweet={toggleRetweet}
/>
```

When the user clicks the "Like" button, two things should happen:

- We should set `isLiked` from `false` to `true`
- We should increment the `numOfLikes` by 1

If the tweet is _already_ liked, the opposite should happen. And the same things should be true for retweets as well.

If you look at the `LikeButton` component, you'll notice that it already takes an `isLiked` prop, and passes it along to the `Heart` component. You need to make sure the state that is held in `App.js` is threaded through, to be used by this component.

> Don't forget to add the PropTypes for the new props you create on `Tweet`! You can use the PropTypes that already exist for reference, or consult the official documentation.

By the end of this first exercise, you should have something that looks like this, and can handle toggling the like/retweet buttons on/off:

![Exercise 1 complete](./__lecture/assets/ex-1-complete.gif)

## Exercise 2: Popping circle

The first part of the exercise we should tackle is the popping circle. For this, we'll use a **keyframe animation**.

Here's the effect we're going for, isolated:

![popping circle](./__lecture/assets/pop-nice.gif)

Create a new `PoppingCircle` folder in `sec/components`, and create the following files:

- index.js
- PoppingCircle.js

`index.js` should contain:

```js
export { default } from './PoppingCircle';
```

> If you're confused by this `index.js`, be sure to read the "Component directory structure" part of this README, near the top of the file! It's explained :)

Inside `PoppingCircle`, create a new component. It should take two props:

- `size`
- `color`

Inside `LikeButton.js`, import this new `PoppingCircle` component, and render it conditionally:

```js
return (
  <Wrapper>{isLiked && <PoppingCircle size={size} color="#E790F7" />}</Wrapper>
);
```

We only want to render the `PoppingCircle` when the tweet is liked; the animation shows briefly when the user clicks the like button, but only when they're liking it; there is no animation when unliking.

Keyframe animations occur immediately on mount. We can leverage this by unmounting it when the tweet isn't liked. That way, the animation retriggers whenever the tweet is re-liked, since the component will be re-mounted every time.

As a reminder, this is what the keyframes syntax looks like with styled-components:

```jsx
import styled, { keyframes } from 'styled-components';

const turnBlue = keyframes`
  from {
    color: inherit;
  }
  to {
    color: blue;
  }
`;

const Wrapper = styled.div`
  animation: ${turnBlue} 500ms;
`;
```

See if you can figure out which properties need to change to enable the animation shown in the GIF above =)

_HINT:_ This animation features a change in size, as well as visibility. Remember that whenever possible, for performance reasons, we only want to animate `transform` and `opacity`, and it is possible to perform this effect with these 2 properties!

_HINT:_ If the heart is hidden _behind_ the popping circle, you can use z-indices to put the heart behind the popping circle!

_HINT:_ If you notice that you're left seeing a big pink circle after the animation completes, you can add the `forwards` keyword, like so:

```js
const Wrapper = styled.div`
  animation: ${someKeyframeAnimation} 500ms forwards;
`;
```

`forwards` means that it will _persist_ whatever settings the keyframe animation ended on. It keeps those values going _forward_ in time. Without this keyword, the properties disappear the moment the animation completes.

_HINT:_ You can play with the easing to make it feel "poppier". Use https://cubic-bezier.com/ to come up with a nice curve.

_HINT:_ You may notice that the circle disappears too early:

![popping circle](./__lecture/assets/pop-default.gif)

In this GIF, the animation is transitioning the right properties, but it disappears so quickly that it's hard to tell!

If you want to animate different properties at different speeds, you can use _multiple keyframe animations_:

```js
const scale = keyframes`
  from {
    some-property: 0;
  }
  to {
    some-property: 1;
  }
`;

const fade = keyframes`
  from {
    some-other-property: hi;
  }
  to {
    some-other-property: bye;
  }
`;

const Wrapper = styled.div`
  animation: ${scale} 300ms forwards, ${fade} 500ms forwards;
`;
```

Notice how each keyframe animation is given a different speed: `scale` is over 300ms, `fade` is over 500ms. This way the fade-out happens slower than the scaling animation.

---

## Exercise 3: Swelling heart

The next step in our animation: A springy, swelling heart:

![Swelling heart](./__lecture/assets/scale.gif)

Create a new component, `ScaleIn`. This component should only take 1 prop, `children`. The idea is that we'll be able to use this component on _anything_ we want to scale in:

```js
// Examples of how we COULD use this component,
// though we'll only use it in 1 way in this workshop:

<ScaleIn>
  HELLO
</ScaleIn>

<ScaleIn>
  <img src="cat.gif" />
</ScaleIn>

<ScaleIn>
  <Banner>
    Limited time sale!!!!!1
  </Banner>
</ScaleIn>
```

Inside our `LikeButton` component, we can wrap the `<Heart>` component we have in this new `ScaleIn` component, _if_ the Tweet is liked:

```js
<Wrapper>
  {/* Conditionally wrap the heart */}
  {isLiked ? (
    <ScaleIn>
      <Heart width={heartSize} isToggled={isLiked} />
    </ScaleIn>
  ) : (
    <Heart width={heartSize} isToggled={isLiked} />
  )}
</Wrapper>
```

Because the animation is springy, we'll use **React Spring** to accomplish it.

Start by installing the dependency with Yarn: it's `react-spring` on NPM.

Because we want the animation to happen on-mount, we'll make use of the `from` prop.

As a reminder, here's an example of how React Spring works. See if you can work out how to transform this example into the effect you want:

```js
import { useSpring, animated } from 'react-spring';

const SomeComponent = () => {
  const style = useSpring({
    opacity: 1,
    from: {
      opacity: 0,
    },
    config: {
      tension: 1000,
      friction: 1,
    },
  });

  return <animated.div style={style}>Boing</animated.div>;
};
```

_HINT:_ Play around with `tension` and `friction` to get the right "springy" feel. You can use the following tools to find the right values:

- https://chenglou.github.io/react-motion/demos/demo5-spring-parameters-chooser/
- https://react-spring-visualizer.com/

.

..

...

....

.....

......

.......

......

.....

....

...

..

.

Here's how to accomplish the springy effect:

```js
const props = useSpring({
  transform: 'scale(1)',
  from: {
    transform: 'scale(0)',
  },
  config: {
    tension: 200,
    friction: 12,
  },
});
```

Your values might be different for `tension` and `friction`, and that's OK! Pick whichever values you like best =)

---

## Exercise 4: Particles ✨

Finally, the last part of this animation is the colorful, circular pieces of confetti that pop out of the heart:

![Particle demo](./__lecture/assets/particles.gif)

There's a few things to notice about this:

- The pieces all move at different angles (away from the center)
- The pieces are randomly-colored
- The pieces have a random distance (some clear the pink circle, but not many)
- There's two "bursts", one early one and one later one.

We'll eventually create something that meets all these conditions, but for now, let's start a bit simpler. Let's aim to create this:

![Particle step 1](./__lecture/assets/particles-step-1.gif)

In this first example, every particle is uniform in everything except "angle".

Create two new components:

- Particle
- ConfettiPiece

Here's the breakdown of responsibilities:

- `Particle` is agnostic as to its contents. It takes a `distance` and an `angle` and it will move its `children` according to those values. It's like the `ScaleIn` component we built earlier: It can move anything around.
- `ConfettiPiece` will handle all of the stuff specific to the circles popping out of the heart: it will control positioning, as well as the UI itself.

Inside `LikeButton`, we want to render a bunch of confetti pieces. We can make use of the `range` utility in `src/utils` to render many copies:

```js
<Wrapper>
  {/* Other stuff ✂️ */}
  {range(12).map(i => (
    <ConfettiPiece key={i} />
  ))}
</Wrapper>
```

Inside `ConfettiPiece`, let's return a red circle, 10px by 10px

> You can create a circle with a `<div>`, `background-color`, and `border-radius`!

We want to solve a problem right off the bat; we want every particle to start in the very center of the heart. If we aren't careful, we'll wind up with a bunch of circles in a line:

![What we DON'T want](./__lecture/assets/dot-line.png)

So inside `ConfettiPiece`, create a styled wrapper, `CenteredWithinParent`. Your first task is to ensure that every red circle sits stacked one on top of the other, right in the center:

![The positioning we want](./__lecture/assets/many-stacked-circles.png)

Let's add a few props to `ConfettiPiece`, and render it conditionally, based on whether the tweet is liked:

```js
<Wrapper>
  {/* Other stuff ✂️ */}
  {isLiked &&
    range(12).map(i => (
      <ConfettiPiece
        key={i}
        angle={360 * (i / 12)}
        distance={20}
        color={PARTICLE_COLORS[0]}
      />
    ))}
</Wrapper>
```

The value for `angle` ensures that the 12 pieces will be evenly spaced across the 360 degrees in a circle.

`distance` will be the # of pixels each particle moves, in the direction specified by the `angle`.

This file came pre-loaded with `PARTICLE_COLORS`, an array of hex color codes, For now, each particle will inherit the first color in the array, which is red.

Our job now is to put `Particle` to work. Let's wrap it around the red circle we created:

```js
// inside ConfettiPiece.js
<CenteredInsideParent>
  <Particle angle={angle} distance={distance}>
    <Circle />
  </Particle>
</CenteredInsideParent>
```

Inside `Particle`, it's time to do some 🎉 trigonometry 🎊.

As a refresher, the thing we need to do is convert between _polar coordinates_ to _cartesian coordinates_.

Polar coordinates are based on a _direction_ and a _distance_. This tends to be easier for humans to think about, in terms of spreading things out evenly.

![polar coordinates](./__lecture/assets/polar.png)

Cartesian coordinates are the X/Y values we always deal with in Javascript.

![cartesian coordinates](./__lecture/assets/cartesian.png)

Inside `Particle`, we need to convert polar to cartesian. The trigonometry isn't the most exciting thing in the world, so here's the formulas you'll need to convert from one to the other:

```js
const convertDegreesToRadians = angle => (angle * Math.PI) / 180;

const angleInRads = convertDegreesToRadians(angle);

const x = Math.cos(angleInRads) * distance;
const y = Math.sin(angleInRads) * distance;
```

Also inside `Particle`, we want to do the animating from start to finish. It's up to you whether you want to use a keyframe animation, or React Spring! Both are reasonable approaches.

At this point, you should see the particles all transitioning from A to B, albeit in lockstep:

![Particle step 1](./__lecture/assets/particles-step-1.gif)

Next, let's add some variety! And this part is left mostly up to you, with some hints.

**NOTE:** Don't feel like you need it to look _exactly_ like the GIF! Feel free to do as much or as little as you want here, and don't be afraid to try something different. **You will not be graded based on how similar your solution is to the provided example**. As long as you have animated confetti, you've met the objective; have fun with it!

The next exercise, Exercise 5, is super important, so don't neglect it!

_HINT:_ you can use `sample` in `src/utils` to get a random color for each ConfettiPiece

_HINT:_ React Spring takes a `delay` option. You can use this to create a "two-stage" burst, by delaying half of the particles by a couple hundred milliseconds. The same option is possible with keyframe animations.

_HINT:_ Pick random values (within a reasonable range) for distance. You can use the `random` helper function in `src/utils`

_HINT:_ By default, the particles all start in the very center of the heart. It might be better for them to start a little further out from the center. What if you repeated the calculation to turn angle/distance into X/Y, but gave a much smaller value for the initial distance?

# Exercise 5: Keeping things accessible

In your OS settings, set "Prefers reduced motion":

- In GTK/Gnome, if gtk-enable-animations is set to false. This is configurable via GNOME Tweaks (Appearance tab or General tab, depending on version). Alternately, add gtk-enable-animations = false to the [Settings] block of the GTK 3 configuration file.
- In Windows 10: Settings > Ease of Access > Display > Show animations in Windows.
- In Window 7: Control Panel > Ease of Access > Make the computer easier to see > Turn off all unnecessary animations (when possible).
- In macOS: System Preferences > Accessibility > Display > Reduce motion.

When liking the tweet with this setting enabled, there should be no animations:

![With and without reducing motion](./__lecture/assets/prefers-reduced.gif)

_This is super important._ A surprising number of people have **vestibular disorders.** This is a class of disorder that involves the inner ear and brain. The most common symptom is vertigo, difficulty balancing. For folks with a condition in this category, motion can make them nauseous, produce severe headaches, and cause general malaise. [More information](https://web.dev/prefers-reduced-motion/).

Whimsical flourishes are wonderful, but not when they come at the expense of a person's health.

To accomplish this, we'll need to take advantage of the [prefers-reduced-motion media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). For keyframe-based animations, we can gate our animations like this:

```js
const Wrapper = styled.div`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${yourThing} 500ms;
  }
`;
```

For some elements, you may wish to hide them entirely if animation is disabled. You can do that with another query:

```js
const Wrapper = styled.div`
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;
```

For animations done in Javascript with React Spring, we need to access the value of that media query from within JS. You can do it like this:

```js
const query = '(prefers-reduced-motion: reduce)';

const mediaQueryList = window.matchMedia(query);

const shouldReduceMotion = mediaQueryList.matches;
```

Once you know in JS whether or not we should disable the animation, there are a couple options:

#### Option A: `immediate`

React Spring has a prop, `immediate`, which makes updates jump immediately to their final state.

```js
const style = useSpring({
  transform: 'whatever',
  config: {
    /* settings */
  },
  immediate: shouldReduceMotion,
});
```

#### Option B: Rendering null

We can also simply decide not to render a component if its only purpose is animation:

```js
const shouldReduceMotion = mediaQueryList.matches;

if (shouldReduceMotion) {
  return null;
}
```

---

# Stretch Goals

## 1. Swirly colors

![Swirly](./__lecture/assets/swirly.gif)

Try animating the colors of each particle over time. This can be done in `ConfettiPiece`.

## 2. Rotating shapes

Instead of using circles, why not try squares or rectangles? To help them look organic, it might be nice to add a bit of rotation, and vary it from piece to piece

## 3. Better prefers-reduced-motion tracking

The code you wrote for Exercise 5 likely doesn't re-run if the user changes their accessibility settings. Ideally, we would listen for changes to that media query, and re-render if the user opts to reduce motion after the page has already loaded.

_HINT:_ You'll need a `useEffect` hook, and the `addListener` API for media queries.

## 4. Taking whimsy to past projects

This workshop is all about whimsy. How can we apply these lessons to previous workshops?

Some ideas:

1. Add particle effects to the cookie clicker game!
2. In the recent ticket-purchasing workshop, we show an error if the request fails. What if the modal did a head-shake, same as this example from Stripe?
   ![headshake](./__lecture/assets/stripe-error.gif)
3. In the routing workshop, we show a number of listings. What if they faded in sequentially, like dominos?
4. Have you seen an effective animation on the web? See if you can recreate it!
