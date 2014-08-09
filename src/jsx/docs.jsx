/** @jsx React.DOM */
'use strict';

/******************************* Dependencies ********************************/

// Third party
var React = require('react/addons'),
    rb    = require('react-bootstrap'),
    Link  = require('react-router').Link;

// Custom components
var id    = require('./utils').rndId,
    md    = require('./markdown').md,
    Code  = require('./code');

/******************************** Components *********************************/

var Docs = React.createClass({
  render: function() {
    return (

<div className={this.props.className}>

<p className='lead'>
  Jisp is a programmable language that compiles to JavaScript.
</p>

<md>{`
It's simpler, terser, and more powerful than JS. Its macro system lets you treat code as data and write functions that write code for you. Jisp's extremely simple syntax protects against common JS pitfalls, and it abstracts away some legacy details, helping avoid errors and keep your code short.

See [Why Jisp](#why) for a gist of why you should use it.

The jisp compiler is itself written in jisp. See the [sourcecode on GitHub](https://github.com/Mitranim/jisp). See the [issues](https://github.com/Mitranim/jisp/issues) section for known problems, upcoming enhancements, and ideas how to contribute to the language.

You can improve this documentation by sending pull requests to the [gh-pages](https://github.com/Mitranim/jisp/tree/gh-pages) branch of the project repository.

> All examples on this page are interactive: edit the jisp to see changes. The JavaScript snippets are compiled in your browser. If you don't see them, make sure JS is enabled and refresh the page.
`}</md>

<h2>Interactive Playground</h2>

<Code>{`
(mac task name ...args (do
  (= pipeline \`(do (handle (,(args.shift) ,(args.shift)))))
  (while (> args.length 0) (do
    (= left  (args.shift)
       right (args.shift))
    (pipeline.push \`(.pipe (handle (,left ,right))))))
  \`(gulp.task ,name (fn ,pipeline))))

(task       'js'
  gulp.src  jsFiles
  conc      'deps.js'
  uglify    (mangle: no)
  gulp.dest 'public/js/tmp/')

(task       'jisp'
  gulp.src  jispFiles
  conc      'app.js'
  jisp      ()
  uglify    (mangle: no)
  gulp.dest 'public/js/tmp/')

; try your own macro call (this is a comment)
`}</Code>

<md>Example of dynamically constructing code with a macro.</md>

<h2 id='installation'>Installation and Usage</h2>

<md>{`
Get [Node.js](http://nodejs.org). This will give you the local \`node\` runtime and the \`npm\` package manager. Install jisp with \`npm\`:

    $ npm install -g jisp

Alternatively, download the source, run \`npm install\` to get the dependencies, and use \`./bin/jisp\` and \`./jisp/jisp.js\` as entry points.

Require in Node, registering the file extension:

    require('jisp/register');

This allows you to \`require\` jisp scripts directly from your code, like so:

    require('./app.jisp');

Launch an interactive REPL:

    $ jisp
    jisp>

Compile a file or directory:

    $ jisp -c <file>

Stream-compile with [gulp-jisp](https://github.com/Mitranim/gulp-jisp).

While not recommended for production, jisp can be directly used in the browser. Include the \`browser/jisp.js\` file with your webpage. It registers the \`text/jisp\` script type to automatically compile and run jisp scripts loaded with \`src\` or included in script tags. It also exposes a global object with the \`compile\` and \`eval\` methods for jisp code. This is how this documentation is implemented.

Super basic Sublime Text build system (OS X):
* \`sudo npm install -g jisp\`
* \`Tools > Build System > New Build System\`
* put lines:

      {
        "cmd": ["jisp", "$file"],
        "path": "/usr/local/bin/"
      }

* save to: \`~/Library/Application Support/Sublime Text 3/Packages/User\`
`}</md>

<h2 id='code-structure'>Code Structure</h2>

<md>{`
_Jisp code consists of nested arrays_. To be easier on the eyes, they're delimited with parentheses \`()\` instead of brackets. Individual elements are separated by whitespace rather than commas. This documentation refers to them as _lists_, but it's just arrays.
`}</md>

<Code>{`
; list that compiles to a function call
(prn 'Fire in the house!')

; quoted list — array literal
\`(1 NaN 'bison')

; empty array literal
\`()

; assignment (name binding)
(= myVar 'myValue')

; function definition
(fn x (alert x))

; see other special forms below
`}</Code>

<md>
Object literals are also delimited with parentheses, elements separated by whitespace rather than commas. This documentation often refers to object literals as _hash tables_ to discern them from objects in general.
</md>

<Code>{`
; object literal (hash table)
(place: 'tavern' drink: 'rum')

; empty object literal
(:)

; alternate hash syntax
(: using 'the' hash 'macro')
`}</Code>

<md>{`
The built-in hash [macros](#macros) \`:\` and \`::\` give you easy ways to build hash tables as lists. \`:\` with two or more arguments runs purely at compile time; other forms have runtime components. See the [built-ins](#built-in-macros) section for details.

Identifiers and literals without parentheses are called _atoms_:
`}</md>

<Code>{`
; number
Infinity

; string literal
'February'

; multiline string
'split across
two lines'

; regex literal
/!@#$%/

; name
parseInt

; special name
null undefined true
`}</Code>

<md>{`
Strings in jisp are multiline.

Parentheses in the jisp code are **not cosmetic**. Your code _consists_ of arrays. This allows to easily deconstruct and construct it when using macros. We'll get to this in the [Macros](#macros) section.

Jisp is mostly whitespace-agnostic. Elements in lists and hash tables are separated by whitespace, but other than that, jisp is completely insensitive to whitespace and indentation, relying on parentheses as delimiters. Forms can contain linebreaks.

In a non-quoted list, the first element is considered a function, and the list compiles as a function call:
`}</md>

<Code>{`
; function call
(alert 'A dragon cometh!')

; nested call
(isNaN (parseInt Infinity))
`}</Code>

<md>In fact, even operators are considered functions and use the prefix notation. This allows them to take multiple arguments:</md>

<Code>{`
; operator expression
(& 2 3 4)
(+ 'using jisp' 'you’re' 'awesome')

; nested operator expressions
(* 4 5 (- 3 6 10) (^ 1 5))
`}</Code>

<md>**[NYI]** Planned feature: you'll be able to pass operators around like any other function:</md>

<Code>{`
(= x \`(1 2 3 4))
(x.sort <)
`}</Code>

<md>Not all lists are function calls. Some are _special forms_ with their own resolution rules. This includes assignment, quoting, function definitions, conditionals, loops, and JS keywords.</md>

<h2 id='everything-exp'>Everything an Expression</h2>

<md>{`
Most languages distinguish statements and expressions. An expression is a piece of code with a value, something you can assign or return from a function. Statements have side effects but no value. In jisp, everything is an expression. It helps you write [functional](http://en.wikipedia.org/wiki/Functional_programming#Coding_styles) code, avoiding unnecessary data fiddling.

An atom such as a number literal, a string literal, or identifier, resolves to itself.

A hash table resolves to itself, with its values resolved individually.

Lists resolve by special rules:
* An unquoted empty list \`()\` (not \`\`()\`) resolves to nothing.
* Special forms starting with a keyword like \`=\`, \`def\`, and others, resolve by their own special rules.
* Lists starting with a macro name resolve as macro calls at compile time.
* Everything else resolves as a function call.

Examples:
`}</md>

<Code>{`
; name binding
(= x 10)

; anonymous function (lambda)
(fn x (/ x 10))

; \`if\` conditional
(if false (/ 1 0) (^ 4 6))

; function definition and call
((fn y (+ 10 y)) 13)
`}</Code>

<md>Inside a nested form, forms are resolved left-to-right, inner-to-outer, just like you'd expect.</md>

<h2 id='quoting'>Quoting</h2>

<md>If lists resolve as function calls, how do you write array literals? The answer is quoting. The special form `(quote x)` prevents the list `x` from being resolved, letting it remain an array. Prepending a list with `` ` `` is shorthand syntax:</md>

<Code>{`
; without quote
(1 2 3)

; with quote
(quote (1 2 3))

; shorthand
\`(1 2 3)
`}</Code>

<md>Directly quoting a non-primitive atom (name or string) stringifies it:</md>

<Code>{`
; name
\`myvar

; string
\`'mystring'
`}</Code>

<md>{`
Which is convenient for macros. Atoms in macro call arguments are quoted implicitly.

Quoting implicitly propagates to inner lists:
`}</md>

<Code>{`
; without quote
(+ (^ 2 1) (is 'π' 'Ω'))

; with quote, invalid javascript
\`(+ (^ 2 1) (is 'π' 'Ω'))
`}</Code>

<md>To let an element resolve, _unquote_ it with a comma `,`:</md>

<Code>{`
; without unquote: invalid javascript
\`((* 2 3) (is true false))

; with unquote: valid javascript
\`(,(* 2 3) ,(is true false))
`}</Code>

<md>Aside from writing array literals, quoting and unquoting is primarily used in macros. See the [Macros](#macros) section below.</md>

<h2 id='blocks'>Blocks and Chaining</h2>

<md>Because jisp code consists of nested expressions, even a multi-line block must be a single expression. How to make one? By wrapping several forms in the special form `do`:</md>

<Code>{`
(def elongate str
  (do (+= str str)
      (prn 'duplicated:' str)
      str))
`}</Code>

<md>{`
On compile, a jisp file is implicitly wrapped in a top-level \`do\` form.

\`do\` resolves to the value of its last form. It's a requirement for chaining methods:
`}</md>

<Code>{`
; take last value
(prn (do (= bugs \`())
  (bugs.push 'butterfree')
  (bugs.push 'beedrill')
  bugs))

; assign result of chaining methods
(= str ',…x')
(= grated (do str
   (.replace /…/g ' … ')
   (.replace /,/g ' , ')
   (.trim)))

`}</Code>


<md>**Note**: `do` is the **only** jisp expression that can consist of multiple forms. The body of each function, loop, etc. is always a single form, and requires a `do` to include multiple expressions.</md>

<h2 id='object-props'>Object Properties</h2>

<md>As you'd expect, object properties are referenced with the `.dot` or `[bracket]` notation:</md>

<Code>{`
(= bunny (bouncy: true fluffy: false))
bunny.bouncy
bunny['fluffy']
`}</Code>

<md>Dot and bracket notation is a syntax shortcut to getting a property of an object. Internally, jisp uses the `(get obj prop)` special form:</md>

<Code>{`
(get bunny bouncy)
(get bunny 'fluffy')
`}</Code>

<md>Quite naturally, you can access properties of resolved forms:</md>

<Code>{`
(String 113) .length
(String 113) [(+ 1 1)]
`}</Code>

<md>But you can also access it with the `get` form, and `do` for chaining (below). This is useful in macros when you pass around names of objects and properties individually.</md>

<Code>{`
(get (String 113) 'length')
(get (String 113) (+ 1 1))
`}</Code>

<md>To chain methods, wrap them in a `do` form:</md>

<Code>{`
(do cartoonSnake
   (.crawlForward 10)
   (.turnLeft)
   (['crawlForward'] 5)
   (.eat 'bunny')
   (.elongate food.weight))
`}</Code>

<md>Alternatively (even though it's kinda gross), you can do it like this:</md>

<Code>{`
(((((cartoonSnake.crawlForward 10)
 .turnLeft)
 ['crawlForward'] 5)
 .eat 'bunny')
 .elongate food.weight)
`}</Code>

<h2 id='functions'>Functions</h2>

<md>Jisp mirrors JavaScript function facilities 1-1 and adds some more.</md>

<h3 id='definition'>Definition</h3>

<md>{`
Named function:

    (def <name> [<... params>] [<body>])
`}</md>

<Code>{`
(def fact x
  (if (is x 0) 1
      (* x (fact (- x 1)))))
`}</Code>

<md>{`
Anonymous function (sometimes called _lambda_):

    (fn [<... params>] [<body>])
`}</md>

<Code>{`
(fn first second (+ first second))

(fn returnMe)

(fn)
`}</Code>

<h3 id='call-return'>Calling and Returning</h3>

<md>A function call is a list starting with the function's name or with a form that resolves to a function:</md>

<Code>{`
(= ringMyBell (fn bell (prn bell)))

(ringMyBell '\\x07')

((fn x (+ 'Hello ' x)) 'World!')
`}</Code>

<md>A function returns the resolved value of its body. You almost never need to return values manually:</md>

<Code>{`
(def numerify x
  (if (isNaN (Number x))
      (do (prn 'not a number:' x)
          NaN)
      (Number x)))
`}</Code>

<md>{`
It's often best to keep each function's body a single conditional tree with branches ending in return values.

Inside a function's body, \`#\` (**NYI**) is an array of the arguments passed to it, and \`#n\` refers to an individual argument by order.
`}</md>

<Code>((fn (* #0 #2)) 3 100 4)</Code>

<md>As a side effect of implicit returns, when making a prototype constructor, you need to end it with `this` as the return value to make the `new` declarations work.</md>

<h3 id='lambda'>Lambda Syntax</h3>

<md>{`
Because functions are so cheap in JavaScript, jisp comes with a shorthand syntax for anonymous functions:

    {<body>}
`}</md>

<Code>{`
{alert 'It’s a dragon!'}

{+ 3 4}

{}
`}</Code>

<md>This goes hand in hand with the `#` notation:</md>

<Code>{`
(= array \`(0 1 2 3))

{* #0 #1}

(array.filter {> #0 1})
`}</Code>

<h3 id='let'>Let</h3>

<md>{`
\`let\` is a short way to declare variables in an isolated scope and run that scope. It resolves to the value returned by its body.

    (let [var value [var value ...]] [<body>])
`}</md>

<Code>{`
(let health 100
  (prn health))   ; logs 100

(? health)        ; false: out ot scope
`}</Code>

<md>Just like assignment, it takes variables in pairs:</md>

<Code>{`
(let plus  110
     minus -12
     (prn (^ plus minus)))

(? plus minus)    ; false: out of scope
`}</Code>

<md>`let` is currently implemented as a self-executing anonymous function. In the future editions of EcmaScript, it will be changed to use the native `let` statement with a block.</md>

<h2 id='assignment'>Assignment</h2>

<md>{`
Like all other forms, assignment uses the prefix notation:

    (= var value [... var value])
    (= var)
`}</md>

<Code>{`
(= newvar 'some value')

(= pi (if (is 2 3) NaN Math.PI))
`}</Code>

<md>{`
All assignments in jisp (not just \`=\`) automatically hoist \`var\` declarations, saving you keystrokes and safeguarding against leaking globals. Variables are only declared if not already in scope. To shadow an outer variable on purpose, use \`let\`.

Like many other forms, \`=\` takes multiple arguments. It assigns them in pairs. Its resolved value is the last assignment:
`}</md>

<Code>{`
(= lastest (= first  'Coffee'
              second 'Beer'
              third  'Milk'))
`}</Code>

<md>The right hand of an assignment can be an arbitrary form, even a block:</md>

<Code>{`
(= x (= shifty null
        picky  (if false 'nose up' 'smile')
        dodgy  (try (+ something) 'unsuccessful')))
`}</Code>

<md>Calling `=` with a single argument merely declares that name if not already in scope:</md>

<Code>(= emptyVar)</Code>

<h2 id='destructuring'>Destructuring Assignment</h2>

<md>{`
Assign to a list of identifiers to take apart the right hand side of the assignment and bind its parts:

    (= (var0 [... varN]) value)
`}</md>

<Code>(= (smaller bigger) `(3 Infinity))</Code>

<md>This assignment is positional: `[0]` `[1]` and so on. To collect all remaining parts into an element, prefix it with `...` or `…`:</md>

<Code>{`
(= (first ...mid closing) \`(4 8 0 3))

mid    ; (8 0)
`}</Code>

<md>`...x` and `…x` is a shortcut to the `(spread x)` special form, which you can, and sometimes need to, use directly. Spreading is moderately greedy: it takes as many elements as possible, but has lower priority than non-spread identifiers.</md>

<h2 id='spreading-rest'>Spreading and Rest Parameter</h2>

<md>Borrowed straight from the upcoming EcmaScript 6 specification.</md>

<h3 id='spread-into-list'>Spread Into List</h3>

<md>In a list, prefix elements with `...` or `…` to spread their elements into the list, flattening it:</md>

<Code>{`
\`(1 2 (3 4) (5 6))

\`(1 2 ...\`(3 4) ...\`(5 6))

; (1 2 3 4 5 6)
`}</Code>

<h3 id='argument-spread'>Argument Spread</h3>

<md>Spread a list into a function call to pass its elements as individual arguments:</md>

<Code>{`
(= pair \`('dog' 'lizard'))

(prn 'cat' ...pair)

; cat dog lizard
`}</Code>

<h3 id='rest-parameter'>Rest Parameter</h3>

<md>Prefix a parameter with `...` or `…` to make it a _rest parameter_ that collects the remaining arguments into a list. This works the same way as destructuring assignment:</md>

<Code>{`
(def categorise quick ...moderate slow
  (prn (+ '(' (moderate.join ' ') ')')))

(categorise 'hare' 'turtle' 'human' 'snail')

; (turtle human)
`}</Code>

<h2 id='conditionals'>Conditionals</h2>

<md>{`
Jisp improves the JavaScript conditionals and gives you some new ones. It's also trivial to define your own conditionals with [macros](#macros).

    is      ; equality test
    isnt    ; inequality test
    not     ; negation
    or      ; ||
    and     ; &&
    in      ; value in iterable
    of      ; property of object
    isa     ; positive type check
    isnta   ; negative type check
    ?       ; existence check
    ?!      ; nonexistence check
    any     ; picks first existing value, if any
    if      ; if
    switch  ; switch
`}</md>

<h3 id='logic'>Logic</h3>

<md>{`
\`is\` is the equality test. With a single argument, it checks its truthiness by double negation. With two or more arguments, it checks if the first equals any of the others by a combination of \`===\` and \`||\`:

    (is <name>)
    (is <name> <something>)
    (is <name> <something> [<other> ...])
`}</md>

<Code>{`
; truthiness check
(is true)

; equality
(is grass 'green')

; or-equality: true if any match
(is she 'smart' 'beautiful' 'artistic')
`}</Code>

<md>{`
\`isnt\` is the inverted form of \`is\` which also takes multiple arguments:

    (isnt <name>)
    (isnt <name> <something>)
    (isnt <name> <something> [<other> ...])
`}</md>

<Code>{`
; falsiness check (same as \`not\`)
(isnt false)

; inequality
(isnt fire wet)

; and-inequality: true if none match
(isnt she 'grumpy' 'magpie' 'far away')
`}</Code>

<md>{`
Logical or is \`or\` and logical and is \`and\`. Like many other forms, they take multiple arguments:

    (or  [<a> [<b> ...]])
    (and [<a> [<b> ...]])
`}</md>

<Code>{`
(or NaN Infinity \`myvar)

(and true 'sun is hot' (< 2 3))
`}</Code>

<md>{`
Check if a value is in an iterable (array or string) with \`in\`:

    (in <value> <iterable>)
`}</md>

<Code>{`
(= bush 'woods')

(in bush \`('forest' 'woods' 'thicket'))  ; true

(in 's' 'mystring')  ; true
`}</Code>

<md>{`
Check if an object has a property with \`of\`:

    (of <property> <object>)
`}</md>

<Code>{`
(= snake (venom:  yes
          fangs:  yes
          talons: no))

(of 'venom' snake)  ; true
`}</Code>

<md>{`
\`isa\` is a short way to test an object's type. It takes multiple arguments and returns true if any match:

    (isa <name> <type> [<type> ...])
`}</md>

<Code>{`
(isa Math.PI 'number')         ; true

(isa null 'number' 'boolean')  ; false
`}</Code>

<md>{`
\`isnta\` is the negated version of \`isa\`. It takes multiple arguments and returns true if none match:

    (isnta <name> <type> [<type> ...])
`}</md>

<Code>{`
(isnta null 'function')          ; true

(isnta 'Sun' 'number' 'string')  ; false
`}</Code>

<h3 id='existence'>Existence</h3>

<md>{`
Jisp provides three powerful existence macros: \`?\`, \`?!\`, and \`any\`.

\`?\` is the ultimate existence checker. This macro takes any number of arguments and resolves to \`true\` if any of them exist (are defined) and to \`false\` otherwise.

    (? <name>)
    (? <name> [<name> ...])
    (? <object.property> [<name> ...])
`}</md>

<Code>{`
(= elephants 'exist')

(? dinosaurs)           ; false

(? mammoths elephants)  ; true
`}</Code>

<md>It's smart about properties: it takes property references apart and checks them in order, starting with the base object, letting you pinpoint the existence of a property with just one conditional:</md>

<Code>{`
(? object.property[0]['method'])

; false because object not defined
; no runtime error
`}</Code>

<md>{`
\`?!\` is the negated version of \`?\` with the exact same qualities:

    (?! <name>)
    (?! <name> [<name> ...])
    (?! <object.property> [<name> ...])
`}</md>

<Code>{`
(?! myVar null)             ; false: null exists

(?! obj.prop[0]['method'])  ; true: not defined
`}</Code>

<md>{`
\`any\` is a sliding switch that combines \`or\` and \`?\`: it resolves to the first value that exists and is truthy, or just the last value that exists:

    (any <name> [<name> ...])
`}</md>

<Code>{`
(any NaN Infinity)

; Infinity: it's truthy

(any false 0 obj.prop[0] Math.PI)

; Math.PI
`}</Code>

<md>Single conditional and no runtime error.</md>

<h3 id='if'>If</h3>

<md>{`
Like everything in jisp, \`if\` is a single form that resolves to a value. When possible, it compiles into the ternary or binary form. You can assign an \`if\` to a variable or return it from a function.

    (if <test> <then> [<elif test then> ...] <else>)
    (if <test> <then> <else>)
    (if <test> <then>)
`}</md>

<Code>{`
; binary form: single statement
(if true (prn 'breaking off'))

; ternary form: single expression per branch
(if (is 'universe expanding')      ; test
    (prn 'flight normal')          ; then-branch
    (alert 'catastrophe'))         ; else-branch

; block form: more than one expression per branch
(if hunting
    (do (= beast (randomBeast))
        (shoot beast))             ; then-branch
    (cook 'meat'))                 ; else-branch
`}</Code>

<md>Like everything else, the block form resolves to a value that can be assigned or returned:</md>

<Code>{`
((def truthiness x
  (if x
    (do (prn 'truthy') x)
    (do (prn 'falsy')  false)))
Infinity)
`}</Code>

<md>{`
Else-ifs are special forms _inside_ the \`if\` expression. The last non-elif expression is taken as the else-branch (undefined if omitted).

    (elif <test> <branch>)
`}</md>

<Code>{`
(if hungry
    (eat)                   ; then-branch
    (elif thirsty (drink))
    (elif tired (sleep))
    (write code))           ; else-branch
`}</Code>

<h3 id='switch'>Switch</h3>

<md>{`
A \`switch\` form automatically inserts \`break;\` statements, protecting you from accidental fall-through:

    (switch <predicate> [<case test body> ...] <default>)
`}</md>

<Code>{`
(= x 0)

(switch x
  (case -1 'negative one')
  (case 0  'zero-ish')
  NaN)
`}</Code>

<md>Quite naturally, `switch` is also an expression that resolves to a value:</md>

<Code>{`
(prn (switch Math.PI
  (case 1 'welcome to Lineland')
  (case 2 'welcome to Flatland')
  (case 3 'welcome to ancient Egypt')
  'world still spinning'))
`}</Code>

<h3 id='try-catch'>Try / Catch</h3>

<md>{`
In jisp, even \`try\` is an expression. Use it like so:

    (try <try> (catch err <catch>) <finally>)
    (try <try> (catch err <catch>))
    (try <try> <catch> <finally>)
    (try <try> <catch>)
    (try <try>)
`}</md>

<Code>{`
(prn
  (try (jump '10 meters high')))  ; implicit catch

(try (eat 'a kilogram of sushi')
  (catch err (prn err))
  (finally 'But I’m happy anyway'))
`}</Code>

<md>More conditionals coming up. The [macro](#macros) system also makes it trivial to define your own conditionals with arbitrary syntax.</md>

<h2 id='loops'>Loops</h2>

<md>Jisp abstracts away the legacy details of JavaScript loops and makes them a lot more expressive. It comes with three loops: `for`, `over`, and `while`.</md>

<h3 id='over'>Over</h3>

<md>{`
The \`over\` loop iterates over values and keys of any object. It also accesses inherited properties and custom prototype methods.

    (over [<value> [<key>]] <iterable> <body>)
`}</md>

<Code>{`
(= animals (squirrel: 'Eevee' fox: 'Vulpix'))

(over val key animals (prn key val))

''
; squirrel Eevee
; fox Vulpix
`}</Code>

<md>`over` automatically builds a list of values from each iteration. This list is its resolved value:</md>

<Code>{`
(= cats (pink: 'Persian' yellow: 'Skitty'))

(= catnames
   (over name cats name))

; ('Persian' 'Skitty')

(= bigcolours
   (over name colour cats (colour.toUpperCase)))

; ('PINK' 'YELLOW')
`}</Code>

<md>Iteration only collects results that are not `undefined`, so you can easily filter them:</md>

<Code>{`
(= cats (pink: 'Mew' yellow: 'Meowth' white: 'Absol'))

(= mCats
  (over cat cats
    (if (is (car cat) 'M')
        cat)))
`}</Code>

<h3 id='for'>For</h3>

<md>{`
When iterating over arrays and strings, you usually want to hit all elements in order and don't want extra properties tagging along. In those cases, use the \`for\` loop:

    (for [<value> [<index>]] <iterable> <body>)
`}</md>

<Code>{`
(for char index 'meow'
  (prn index char))

''
`}</Code>

<md>It resolves to a list of values from each iteration. Just like `over`, it filters them by `undefined`:</md>

<Code>{`
(= array \`(('drink' 'milk')
           ('sweet' 'icecream')
           ('drink' 'coffee')))

(prn '-- all:')
(prn (for x array x))

(prn '-- only drinks:')
(for x array
  (if (is (car x) 'drink') x))
`}</Code>

<md>{`
**[NYI]**: planned feature. If the iterable is an integer larger than 0, jisp will substitute it for a range starting at 1, making for a repeat-N loop:

    (= warcry '')
    (for 5 (+= warcry 'waagh! '))
    warcry
    ; waagh! waagh! waagh! waagh! waagh!
`}</md>

<h3 id='while'>While</h3>

<md>{`
For finer-grained control, use the \`while\` loop. It works like in JavaScript, but like everything in jisp, it's an expression. By default, it resolves to a list of values from each iteration. Like \`for\` and \`over\`, it filters them by \`undefined\`, allowing you to skip values:

    (while <test> <body>)
`}</md>

<Code>{`
(= bugs \`('missing comma' 'missing semicolon'))

(prn
  (while (> bugs.length 0)
         (+ (bugs.shift) ' avoided')))

(= array \`(0 1 2 3 4))

(= even
  (while (> array.length 0)
    (do (= x (array.pop))
        (if (is (% x 2) 0) x))))
`}</Code>

<md>{`
You can also order a final resolved value:

    (while <test> <body> <return-value>)
`}</md>

<Code>{`
(= beers 0)
(def sober (< beers 10))

(= drunk (while (sober)
                (++ beers)
                (+ 'drunk after ' beers ' beers')))

; drunk after 10 beers
`}</Code>

<h2 id='comprehensions'>Comprehensions</h2>

<md>{`
Other languages typically devise special syntax for list comprehensions (a set builder notation). In jisp, you get the same functionality just by combining its basic features.

\`range\` is a trivial built-in function that returns a list from N to M:
`}</md>

<Code>{`
(range 0 5)

; (0 1 2 3 4 5)
`}</Code>

<md>`for` and `while` (see [Loops](#loops)) are list-building expressions and can be combined with `range`, and optionally `if`, to make a comprehension:</md>

<Code>{`
(prn
  (for x (range 0 6) (* x x)))

; (0 1 4 9 16 25 36)

(for x (range 0 6)
     (if (is (% x 2) 0)
         (* x x)))

; (0 4 16 36)
`}</Code>

<h2 id='macros'>Macros</h2>

<md>{`
Macros are compile-time functions that generate code. A macro takes code as input and returns code that's put in its place. At compile, macro definitions are yanked from your code, then macros are recursively expanded. After all macros are expanded, jisp is compiled to JS:

    Definition:
    (mac name [<params>] <body>)

    Call:
    (<name> [<code>])
`}</md>

<Code>{`
(mac firstDefinedTruthy ...values
  \`(or ,...(for value values
    \`(and (? ,value) ,value))))

(firstDefinedTruthy NaN Infinity myVar)

; add your own macro call here
`}</Code>

<md>{`
Most of [\`jisp.jisp\`](https://github.com/Mitranim/jisp/blob/master/src/jisp.jisp) is written with macros.

The lifetime of your code without macros:

    code -> compile into JS -> execute

The lifetime with macros:

    code => parse macros <-> expand macros -> compile into JS => execute

It seems to be a trend among modern languages to introduce limited macro support in form of templates. Jisp brings macros to JavaScript but it's **not** limited to templating. Macros are complete, real, custom functions using the full power of the language to run arbitrary logic and transform code in arbitrary ways.
`}</md>

<h3 id='templating'>Templating</h3>

<md>{`
Templating is the most basic use. Let's make a macro that generates named function definitions:

    Prefix code to return with \`:
    \`(<code>)

    Unquote elements with , to resolve (transclude) them during macro call:
    \`(<code> ,<elem> <code>)
`}</md>

<Code>{`
; yanked at macro parse
(mac makeReduce name operator
  \`(def ,name ...args
    (if (isnt args.length 0)
        (args.reduce {,operator #0 #1}))))

; yanked at macroexpand
(makeReduce mul *)

; code put back at macroexpand
; (def mul ...args
;   (if (isnt args.length 0)
;     (args.reduce {* #0 #1})))

; add your own macro call here
; try a non-operator
`}</Code>

<md>{`
In this example, the macro returns the form starting with \`def\`. Quoting with \`\` \` \`\` prevents this form from resolving during the macro call and lets the macro return it as code. Unquoting the macro arguments \`name\` and \`operator\` by prepending them with \`,\` transcludes them into the template. Try adding your own macro calls to generate new definitions.

Because macros are real functions, you can edit the return code in arbitrary ways. For instance, based on the arguments passed. Let's make our operator macro slightly more versatile:
`}</md>

<Code>{`
(mac makeReduce name operator zeroValue
  \`(def ,name ...args (do
    ; included if zeroValue was passed
    ,(if (? zeroValue)
      \`(args.unshift ,zeroValue))
    ; included always
    (if (is args.length 0)
      ,zeroValue  ; defaults to undefined
      (args.reduce {,operator #0 #1})))))

(makeReduce add +)

(makeReduce div / 1)

; try your own macro call
`}</Code>

<md>In this example, the logic `(args.unshift ,zeroValue)` is only included if a `zeroValue` was passed to the macro. Run the resulting functions with none and one argument to see the difference.</md>

<h3 id='code-construction'>Code Construction</h3>

<md>{`
Because jisp code is a series of nested arrays, macros can deconstruct and construct it on the fly. This is why we have those parentheses.

As a silly example, you could enable reverse syntax by reversing the code passed to a macro:
`}</md>

<Code>{`
(mac reverse form (do
  (def rev form
     (if (Array.isArray form)
         (do (for f form
               (rev f))
             (.reverse))
         form))
  (rev form)))

(reverse
  (('world' 'hello ' (() quote) +) prn))

; try your own reverse code
`}</Code>

<md>{`
But let's get more serious. Getting back to the example at the top of the page. Suppose you're writing a gulp config file full of repetitive blocks like these:

    gulp.task('jisp', function() {
      return handle(gulp.src(jispFiles))
      .pipe(handle(concat('app.js')))
      .pipe(handle(jisp()))
      .pipe(handle(uglify({mangle: false})))
      .pipe(handle(gulp.dest('public/js/tmp/')));
    });

You can't deduplicate this with functional abstractions alone, and are forced to write this repetitive code by hand. But you can abstract it away with a macro:
`}</md>

<Code>{`
(mac task name ...args (do
  (= pipeline \`(do (handle (,(args.shift)
                            ,(args.shift)))))
  (while (> args.length 0) (do
    (= left  (args.shift)
       right (args.shift))
    (pipeline.push \`(.pipe (handle (,left ,right))))))
  \`(gulp.task ,name (fn ,pipeline))))

; call it like so:

(task       'jisp'
  gulp.src  jispFiles
  conc      'app.js'
  jisp      ()
  uglify    (mangle: no)
  gulp.dest 'public/js/tmp/')

; try adding your own task
`}</Code>

<md>{`
What happened? The macro takes its arguments as an array, takes it apart in pairs, and constructs a new array of the resulting code, filling in the repetitive blocks we wanted to dedup. The constructed code in this example is:

    (gulp.task 'jisp' (fn (do
      (handle (gulp.src jispFiles))
      (.pipe (handle (conc 'app.js')))
      (.pipe (handle (jisp)))
      (.pipe (handle (uglify (mangle: no))))
      (.pipe (handle (gulp.dest 'public/js/tmp/'))))))

And it replaces the macro call before the code is compiled.

We've just enabled a new shorter, cleaner syntax for the rest of our configuration file, and deduplicated our code in a way not possible with plain JavaScript. It should be noted that macros take any kind of input; it could be hash tables or bigger blocks of code. See [\`jisp.jisp\`](https://github.com/Mitranim/jisp/blob/master/src/jisp.jisp) for bigger examples.

Macros can have arbitrary symbols and even literal strings as names. Suppose you're writing a lot of prototype extenders and want to shorten the definitions. In other languages, you're lucky if you have special syntax for that. In jisp, make the syntax yourself:
`}</md>

<Code>{`
(mac @ obj method ...args body
  \`(= (get (get ,obj "prototype") ,(JSON.stringify method))
      (fn ,...args ,body)))

(@ Plant grow time speed
  (+= this.length (* time speed)))

(@ Animal growl decibels
  (= this.loudness decibels))
`}</Code>

<md>Sometimes you want the code returned from a macro to contain new variable binginds. Prefix a name with `#` to make it a service name that is guaranteed to be unique in the current scope. If it clashes with any other variable, it will be renamed to avoid the conflict.</md>

<Code>{`
(mac myDefinition
  \`(= #uniq 'my unique variable'))

(myDefinition)

(= uniq 'declared outside macro')
`}</Code>

<md>Finally, macros can self-expand on definition:</md>

<Code>{`
((mac pr x \`(process.stdout.write ,x)) 'hello world')
(pr 'another call')

((mac add ...x \`(+ ,...x)) 99 44 11)
(add Infinity -Infinity)
`}</Code>

<h3 id='macro-import-export'>Macro Import and Export</h3>

<md>{`
Macros can be imported in three ways:
* compile or \`require\` a macro-containing file before others within the same Node runtime or on the same browser page;
* use the \`importMacros\` method of the object exported by the compiler or the global \`jisp\` object in the browser;
* access the \`macros\` store exported by the compiler.

Macros are kept in the \`macros\` object that exists during the compiler runtime. It's exposed in the \`jisp\` object and can be accessed and modified directly. The recommended way to import macros is by calling the \`importMacros\` method that takes one or more macro stores and merges them into the macro object, overriding the existing macros. Each store is a hash table where keys are macro names and values are macro functions.

    (= myStore (testMacro: (fn \`nameToReturn)))

    (= jisp (require 'jisp'))

    (jisp.importMacros myStore)

    (testMacro)  ; replaced by \`nameToReturn\`

The \`macros\` object persists between compiler calls. If you're using a build script that compiles multiple jisp files within the same runtime, you can simply put macros in a file and require or compile it before others. This also works when running jisp scripts directly with \`require\`.

When a macro is referenced in code, it's embedded at the top of your program and can be assigned and exported from a module. See [\`macros.jisp\`](https://github.com/Mitranim/jisp/blob/master/src/macros.jisp) for an example.
`}</md>

<h3 id='macro-notes'>Notes</h3>

<md>{`
After each macro expansion, the new code is recursively checked for macro definitions and calls. This allows macros to be nested, and even contain new macro definitions. See [\`jisp.jisp\`](https://github.com/Mitranim/jisp/blob/master/src/jisp.jisp) for examples; most of it is written with nested macros.

To avoid confusing macros for functions, it's good style to begin their names with \`mac\`.

It's important to realise that macros are compile-time, not run-time. They live in the land of names, not in the land of values like functions. Rather than passing values by names to macros, you pass _names_, or code in general. A macro doesn't give a flying duck about scope or variable bindings. You aren't constrained by scope or object reference issues, and don't have to pass around objects you want to access. You just construct the code you want, where you want it, at compile time.
`}</md>

<h2 id='built-ins'>Built-ins and Embedding</h2>

<md>Jisp comes with some built-in macros and functions, and faculties for importing them and embedding into compiled programs.</md>

<h3 id='built-in-macros'>Macros</h3>

<md>Most built-in macros are conditionals. See the [conditionals](#conditionals) section. Some are property accessors. `prn` is a syntax-level alias for `console.log`.</md>

<Code>{`
(car   x)
(head  x)
(cdr   x)
(tail  x)
(init  x)
(last  x)
(let   x 10 (* x 2))
(isa   x 'type')
(isnta x 'type')
(?     x.y)
(?!    x.y)
(any   x y)
(prn   x y)
`}</Code>

<md>`:` is a hash table builder. When given multiple arguments, it takes them as key-value pairs and compiles to an object literal:</md>

<Code>(: basic 'hash' table 'syntax')</Code>

<md>This has its use in macros (at compile time). To use the hash builder at runtime, call it with a single argument:</md>

<Code>{`
(= calc \`('number' Math.PI 'professor' 'Archimedes'))

(JSON.stringify
  (: calc))
`}</Code>

<md>{`
Take note that \`:\` is _destructive_. \`(: ( .slice))\` your lists if you want to keep originals.

\`::\` is a concatenating hash builder. It concatenates its arguments, flattening them if they're arrays, and passes the result to \`:\`.
`}</md>

<Code>{`
(JSON.stringify
  (:: \`('first' 'pair') \`('second' 'pair')))
`}</Code>

<md>`::` is particularly useful for building hashes in loops.</md>

<Code>{`
(def duplicate ...args
  (:: (for arg args \`(arg arg))))

(JSON.stringify
  (duplicate 'troubles' 'happiness'))
`}</Code>

<h3 id='built-in-functions'>Functions</h3>

<md>{`
Jisp has a special faculty for adding global functions to the language. If any of them is referenced in code, it's embedded at the top of your program on compile. No globals are leaked. If the function is reassigned before being referenced, it's not embedded. Like with macros, jisp provides a way to import these functions, extending the language. It also comes with a few:

\`list\` is a list (array) builder. It's roughly equivalent to \`(Array x)\`, but also accepts 0 or 1 arguments.

    (list [<args> ...])
`}</md>

<Code>{`
(list)

; ()

(list 'wizard' 'hat' 'staff')

; ('wizard' 'hat' 'staff')
`}</Code>

<md>{`
\`concat\` is like \`list\` except it flattens lists passed as arguments, concatenating them:

    (concat [<args> ...])
`}</md>

<Code>{`
(concat \`(yes no) \`(NaN) Infinity)

; (yes no NaN Infinity)
`}</Code>

<md>{`
\`range\` is a function that builds a list from N to M. It's used in comprehensions:

    (range [start] end)  ; default start 0
`}</md>

<Code>{`
(range -1 6)

; (-1 0 1 2 3 4 5 6)
`}</Code>

<h3 id='function-import-export'>Function Import and Export</h3>

<md>{`
Similarly to macros, functions can be imported in two ways:
* use the \`importFunctions\` method of the object imported with \`require\` or the global \`jisp\` object in the browser;
* directly access and modify the function store exposed by the module.

The global functions are stored in the \`functions\` object that exists during the compiler runtime. Unlike macros, compiling a file doesn't affect the function store. You need to import them like so:

    (= myFuncs (sqr:  (fn x (* x x))
                cube: (def cube x (* x x x))))

    (= jisp (require 'jisp'))

    (jisp.importFunctions myFuncs)

    sqr      ; function embed
    (cube 3) ; function embed, 27

Try this in a REPL or a file to see how functions are embedded after importing. This faculty makes it easy to extend the language in a modular way with zero global leaks and zero global dependency.
`}</md>

<h2 id='style'>Style</h2>

<md>{`
Jisp is insensitive to whitespace, but humans don't read code by counting parens; we read it by indentation. Your indentation should reflect the nesting of expressions, branches of execution. Parallel branches share the same indent, nested branches are indented further.

    ; BAD, misleading about nesting
    (def plusname name
         (if (isNaN (Number (last name)))
         (+ name 0)
         (+ (init name) (+ 1 (Number (last name))))))

    ; GOOD, reflects branching properly
    (def plusname name
         (if (isNaN (Number (last name)))
             (+ name 0)
             (+ (init name) (+ 1 (Number (last name))))))

When nesting isn't deep, try lining up each next indent with the second word on the preceding line (example above). Otherwise, stick with two spaces for each new level.
`}</md>

<h2 id='why'>Why Use Jisp</h2>

<md>{`
#### Simple and Safe

Despite being more powerful, jisp is a lot [simpler](#code-structure) than JavaScript. Is has practically no syntax; there's no semicolons, commas, or linebreaks to trip yourself over, no special rules for keywords and operators. Everything uses the same rules, making it hard to make an error.

It also absracts away legacy implementation details like [\`var\`](#assignment), [\`break\`](#switch) and the primitive [\`for\`](#for) loop, eliminating entire classes of easy to make and hard to spot errors.

#### Powerful

At its heart, jisp is just JavaScript. But it's also much more.

On the surface level, it builds some coding patterns right into the language and provides powerful higher-level [conditionals](#conditionals) and [loops](#loops), making your programs terser. Its [expressive](#everything-exp) functional syntax and implicit value resolution lets you focus on your ideas and have the language take care of data returns.

More importantly, it lets you define syntactic abstractions and automatically [generate code](#macros), [reprogram](#macro-import-export) and [extend](#function-import-export) the language, implement embedded domain-specific languages on top of JS, deduplicate code in ways impossible with plain JavaScript.
`}</md>

<h3 id='why-over'>Why Jisp Over [insert dialect X]</h3>

<md>{`
There's a bunch of Lisp-JavaScript dialects floating in the wild. So why jisp?

#### JavaScript-first

Most other Lisp-JavaScript implementations are attempts to port a [language X] to JavaScript. In best cases, they carry legacy design details that don't make sense in the JavaScript environment or obfuscate the code (example: artificial distinction between arrays and code in most dialects). In worse cases, they clog the runtime with a reimplementation of another language on top of JavaScript.

Jisp is JS-native and axiomatic. Is has no needless concepts, no legacy syntax, and no runtime cost. Jisp focuses on the core ideas of code-as-data, S-expressions, macros, and brings them to JavaScript, introducing as few new concepts as possible. Everything else is left looking familiar and fits intuitively within the new syntax.

It also carefully abstracts away legacy JavaScript pitfalls, making the language safer without introducing alien concepts as a cost.

Jisp doesn't target an [insert language X] programmer. It targets the JavaScript programmer.

#### Featureful

Jisp is full of features of [immediate](#existence), practical use to a JavaScript developer. It's not different for difference sake: it enables a [whole new level](#macros) of abstraction and makes [full use](#built-ins) of it, coming prepackaged with powerful tools. It takes practical features from other modern languages and the future of JavaScript and gives them to you now. Built-in macros and functions, shortcuts to common patterns, import and embedding for macros and global functions, spreading, destructuring, and more.

#### Axiomatic

Despite aiming for features, jisp takes the minimalistic, simplest possible approach to design. It wants you to type less and do more with less code. It doesn't try to imitate [language X] — or JavaScript, for that matter. It aims to be [succinct](#lambda) and get out of your way.
`}</md>

<h2 id='acknowledgements'>Acknowledgements and Notes</h2>

<md>{`
Jisp is massively inspired by [CoffeeScript](http://coffeescript.org) and uses bits of its source for CLI utils. Design inspiration from [Arc](http://paulgraham.com/arc.html) and the Lisp family of languages, bits from other places. General inspiration from [Arc-js](https://github.com/smihica/arc-js).

Reach me out by instant messaging (preferably Skype) or email. See my contacts [here](http://mitranim.com). The email is also a Jabber ID.

Copyright (c) 2014 Mitranim, under the MIT License ([source](https://github.com/Mitranim/jisp/blob/master/license) / [docs](https://github.com/Mitranim/jisp/blob/gh-pages/license)).
`}</md>

</div>

    );
  }
});

/********************************** Export ***********************************/

module.exports = Docs;
