# components/

A big goal of good digital design is to encourage consistency across user interface components.

**BUT, paradoxically, the goal of any practical user interface development effort must be to build _as few reusable JavaScript components as possible_.**  Attempting to make user interface logic reusable is almost always a mistake, and is a source of technical debt seasoned project managers see time and time again across all kinds of projects.

A good rule of thumb:  Don't make a function reusable until you're using _exactly_ the same code in two places.  Don't make a UI component reusable unless (A) you're an expert with the front-end framework you're using, (B) you're using _exactly_ the same component in at least three places across your planned user interface and (C) the project stakeholders do not anticipate any changes to the relevant parts of the user interface.

-mikermcneil
