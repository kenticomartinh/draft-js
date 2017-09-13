/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getOffsetInNode
 * @typechecks
 * @flow
 */

'use strict';

function getTextLengthFromNode(node: Node): number {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.length;
  }
  let length = 0;
  for (var ii = 0; ii < node.childNodes.length; ii++) {
    length += getTextLengthFromNode(node.childNodes[ii]);
  }
  return length;
}

function getTextLengthFromPreviousSiblings(node: Node): number {
  let sibling = node.previousSibling;
  let length = 0;
  while (sibling) {
    length += getTextLengthFromNode(sibling);
    sibling = sibling.previousSibling;
  }
  return length;
}

/**
 * Gets the offset in the given node adjusted relatively to the given root node
 */
function getOffsetInNode(
    rootNode: Node,
    offsetNode: Node,
    offset: number,
): number {
  let node = offsetNode;
  let adjustedOffset = offset;
  while (node && node !== document.documentElement) {
    if (node === rootNode) {
      // If root node found, offset is finally adjusted
      return adjustedOffset;
    }
    adjustedOffset += getTextLengthFromPreviousSiblings(node);
    node = node.parentNode;
  }
  // If root node not reached, return original offset
  return offset;
}

module.exports = getOffsetInNode;
