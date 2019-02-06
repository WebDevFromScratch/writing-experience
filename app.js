let Inline = Quill.import('blots/inline');
let Block = Quill.import('blots/block');

class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

class LinkBlot extends Inline {
  static create(value) {
    let node = super.create();
    // Sanitize url value if desired
    node.setAttribute('href', value);
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';

class HeaderBlot extends Block {
  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}
HeaderBlot.blotName = 'header';
// Medium only supports two header sizes, so we will only demonstrate two,
// but we could easily just add more tags into this array
HeaderBlot.tagName = ['H1', 'H2'];

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(LinkBlot);
Quill.register(BlockquoteBlot);
Quill.register(HeaderBlot);

let quill = new Quill('#editor-container');
quill.addContainer($("#tooltip-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
  if (eventType !== Quill.events.SELECTION_CHANGE) return;
  if (range == null) return;
  if (range.length === 0) {
    $('#tooltip-controls').hide();
    let [block, offset] = quill.scroll.descendant(Block, range.index);
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement) {
      // nothing for now, but stuff will be probably added later
    } else {
      $('#tooltip-controls').hide();
    }
  } else {
    let rangeBounds = quill.getBounds(range);
    $('#tooltip-controls').show().css({
      left: rangeBounds.left + rangeBounds.width/2 - $('#tooltip-controls').outerWidth()/2,
      top: rangeBounds.bottom + 10
    });
  }
});

// TODO: get rid of jQuery
// TODO: don't always set to 'true', but rather do a toggle
$('#bold-button').click(function() {
  quill.format('bold', true);
});
$('#italic-button').click(function() {
  quill.format('italic', true);
});
$('#link-button').click(function() {
  let value = prompt('Enter link URL');
  quill.format('link', value);
});
$('#blockquote-button').click(function() {
  quill.format('blockquote', true);
})
$('#header-1-button').click(function() {
  quill.format('header', 1);
});
$('#header-2-button').click(function() {
  quill.format('header', 2);
});
