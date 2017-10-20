/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule findAncestorBlockNode
 * @typechecks
 * @flow
 */

'use strict';

/**
 * Get the node's nearest ancestor block.
 */
function findAncestorBlockNode(node: Node): ?Node {
  let searchNode = node;
  while (searchNode && searchNode.parentNode !== document.documentElement) {
    var isBlock = (searchNode.parentNode.getAttribute('data-contents') === 'true');
    if (isBlock) {
      return searchNode;
    }
    searchNode = searchNode.parentNode;
  }
  return null;
}

module.exports = findAncestorBlockNode;
