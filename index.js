"use strict";

const Matter = require('matter-js');

/**
 * A matter.js plugin to allow applying forces to parts of a body.
 * @module Part2Body
 */
const Part2Body = {
  // plugin meta
  name: 'matter-part2body', // PLUGIN_NAME
  version: '0.0.1', // PLUGIN_VERSION
  for: 'matter-js@^0.12.0',

  // installs the plugin where `base` is `Matter`
  // you should not need to call this directly.
  install: function(base) {

    // before Matter.Body.applyForce, if the body is a part, return the parent in this 
    base.before('Body.applyForce', function (body, position, force) {
      let parent = topParent(body);
      
      if (parent != body) {
        return parent;
      }

    });

    // after Matter.Body.applyForce, if this is not empty, apply the force to the parent body
    base.after('Body.applyForce', function (body, position, force) {
      if (this != undefined) {
        Matter.Body.applyForce(this, position, force);
      }
    });
  }
};

Matter.Plugin.register(Part2Body);

module.exports = Part2Body;

/**
 * @namespace Matter.Body
 * @see http://brm.io/matter-js/docs/classes/Body.html
 */

/**
 * Function to get the top parent of a part.
 * @function topParent
 * @param {Matter.Body} body The body part.
 * @returns {Matter.Body} body The top body containing the part.
 */
function topParent(body) {
  var parent = body.parent;

  if (parent != body) {
    parent = topParent(parent);
  }

  return parent;
}