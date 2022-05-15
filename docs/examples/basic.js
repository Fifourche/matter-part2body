// install plugin
Matter.use(
  'matter-part2body' // PLUGIN_NAME
);

var Example = Example || {};

Example.basic = function() {
  var Engine = Matter.Engine,
    Common = Matter.Common,
    Events = Matter.Events,
    Render = Matter.Render,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(document.documentElement.clientWidth, 800),
      height: Math.min(document.documentElement.clientHeight, 600),
      showVelocity: false,
      wireframes: false
    }
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add walls
  World.add(world, [
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
  ]);

  // create negative and positive parts
  var negative = Bodies.circle(290, 100, 30, {render: {fillStyle: '#4287f5'}}),
      positive = Bodies.circle(350, 100, 30, {render: {fillStyle: '#f54242'}});

  // create a dipole, composed of the previous parts
  var dipole = Body.create({parts: [positive, negative]});

  // add dipole to the world
  World.add(world, [dipole]);

  // function to apply a random force to the negative part, on click
  const onClickApplyForce = () => {
    var force = {x: Common.random(-0.5, 0.5), y: Common.random(-0.5, 0.5)};
    Body.applyForce(negative, negative.position, force);
  };

  // create the button
  createButton(onClickApplyForce);


  // Draw force vector of the dipole body
  Events.on(render, 'afterRender', function() {
    var context = render.context,
        scaling = 200; // scaling for the vector to draw

    Render.startViewTransform(render);

    context.beginPath();
    context.moveTo(negative.position.x, negative.position.y);
    context.lineTo(negative.position.x + scaling*dipole.force.x, negative.position.y + scaling*dipole.force.y);

    context.strokeStyle = '#eb9834';

    context.lineWidth = 3;
    context.stroke();

    Render.endViewTransform(render);
});


  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
  });

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };


  // create and add the button to apply force
  function createButton(onClickFunc) {
    // main container
    var container = document.querySelector(".matter-part2body");

    // Force button
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("Apply random force"));
    button.style.cssText += 'background: #d459ab;border: none;border-radius: 0.5rem;color: white;display: block;font-size: 2rem;font-weight: 900;padding: 0.25rem 1rem;position: relative;z-index: 10;';

    container.appendChild(button);

    button.addEventListener("click", onClickFunc);
  }
};


