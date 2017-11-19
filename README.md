# Closer Project Client

Frontend client for [Closer Project](https://github.com/albertopereira/closer-project)

## Table of contents

[[Summary|#Summary]]

## Summary

This documents details the technological architecture of the client application. The client module generates either a complete visualization or a view of a budget of a specific municipality through the years. As it consumes the data from the API, it can be housed in any other server.

## Technologies

CLOSER client application is built over [VueJS](https://vuejs.org/), a javascript framework. Being decoupled and consuming data from an API service, other technologies can be used to create new clients, or new versions of the official client, enhancing the versatility of the application, and providing a needed flexibility for a long lifecycle.
More specifically, its based on [Vue-Cli](https://github.com/vuejs/vue-cli), which uses the vuejs-webpack template, containing a webpack + vue-loader setup with hot reload, linting, testing & css extraction, and a router (vue router).

## External libraries and components

Any external library and component outside the scope of the vuejs framework core is listed here.

| Name | Description | URL |
|:--------|:--------------|:------|
|**vue-router** | `vue-router` is the official router for Vue.js. | https://github.com/vuejs/vue-router |
|**axios**| Promise based HTTP client for the browser and node.js | https://github.com/axios/axios |
|**Vuex**| Centralized State Management for Vue.js. | https://github.com/vuejs/vuex | 
|**vuex-router-sync**| Sync vue-router's current $route as part of vuex store's state. | https://github.com/vuejs/vuex-router-sync | 
|**D3**| D3 is a JavaScript library for visualizing data with HTML, SVG, and CSS. | https://d3js.org/ | 
|**cardinal-spline-js**| A Cardinal spline (basically a Catmull-Rom with a tension option) implementation for JavaScript/HTML5. | https://github.com/epistemex/cardinal-spline-js | 

## Structure

The following diagram represents the overall structure of the client application.

![Closer client structure](http://closer-project.com/docs/images/vuex_structure_diagram.png)

## Sequence Structure

The following diagram represents the sequence structure of the client application.

![Closer client sequence structure](http://closer-project.com/docs/images/vuex_sequence_diagram.png)

## Components

__Treemap__

![Treemap](http://closer-project.com/docs/images/treemap.png)

This component is an implementation of a D3 visualization in Vuejs, which eliminates 3d-select and the need for an explicit rerender of the svg composition. It binds attributes to svg elements, and the svg structure, explicitly defined in the template, reflects the computed data, at any moment, taking advantage of the reactive nature of vuejs. Thus, by setting events (on click events in this project) on the svg elements, a new data tree can be refactored and the changes immediatly reflected in the visualization.

__Card__

![Card](http://closer-project.com/docs/images/card.png)

The card component shows the summary of the data, expliciting the total value of the budget fot that year, the average per year, and the growth compared to the previous year. It also provides a legend for the treemap.

__Chart__

![Chart](http://closer-project.com/docs/images/chart.png)

The Chart component represents the growth of the selected data (through the treemap), throughout all the years in the data. It uses the reactive properties of computed elements to redraw svg elements and, to reflect the curved lines in the chart, uses the [cardinal-spline-js](https://github.com/epistemex/cardinal-spline-js) to create an interpolated smooth curve through each point pair in the data, preventing the need for calculating control points for a Bezier Curve.

__Tabular__

![Tabular](http://closer-project.com/docs/images/tabular.png)

The Tabular component shows a tabular visualization for the data, resorting to a recursive structure to nest the values. To show the growth through the years of each value row, it uses the [cardinal-spline-js](https://github.com/epistemex/cardinal-spline-js) to create an interpolated smooth curve through each point pair in the data, preventing the need for calculating control points for a Bezier Curve.

__Heatmap__

![Heatmap](http://closer-project.com/docs/images/heatmap.png)

The Heatmap component shows the geographical incidence of the data for a given year. This component uses the Google Maps API to draw the map.

## API

Access to the Closer Project Server API endpoint is made through Vuex Actions (store/actions.js), following the structure http://closer-project.com/api/view/[budget_id]/[view_id] 

## Store

Data in the client is centralized in a collection of globally accessible objects, called the store. Every change in the data will have a correspondent change in a rerendered component, that represents that data. The main element of the data store, served by the API, is an object with the following structure:


### Budget

| Field | Datatype | Description |
|:------|:---------|:------------|
| key    | String  | The name of the budget |
| coords | String | The coords (lat, lng) for the map center|
| descr | String | The description |
| src | String | The source of the data  |
| values | Array[Value] | The values for the overall data |
| view | Array | Contains the selected views |
| children  | Array[Budget] | The children of the given budget node |

## Value

| Field | Datatype | Description |
|:------|:---------|:------------|
| year    | String  | The year of the value |
| val | Float | The value for the year |

A typical data object returned by the API will look like this:

``` json

{
   "key":"Câmara Municipal de Lisboa",
   "descr":"Programas Lisboa - 2017-2019",
   "src":"no-reply@closer.com",   
   "coords":"38.7057302,-9.1414086",
   "children":[
      {
         "key":"EIXO A - LISBOA MAIS PRÓXIMA",
         "descr":"EIXO A - LISBOA MAIS PRÓXIMA",         
         "values":[
            {
               "year":"2017",
               "val":123430
            },
            {
               "year":"2018",
               "val":86991
            },
            {
               "year":"2019",
               "val":44478
            }
         ]
      },
      {
         "key":"EIXO B - LISBOA EMPREENDEDORA",
         "descr":"EIXO B - LISBOA EMPREENDEDORA",         
         "values":[
            {
               "year":"2017",
               "val":1258
            },
            {
               "year":"2018",
               "val":1177
            },
            {
               "year":"2019",
               "val":677
            }
         ]
      },
      {
         "key":"EIXO C - LISBOA INCLUSIVA",
         "descr":"EIXO C - LISBOA INCLUSIVA",         
         "values":[
            {
               "year":"2017",
               "val":45677
            },
            {
               "year":"2018",
               "val":73622
            },
            {
               "year":"2019",
               "val":32344
            }
         ]
      },
      {
         "key":"EIXO D - LISBOA SUSTENTÁVEL",
         "descr":"EIXO D - LISBOA SUSTENTÁVEL",         
         "values":[
            {
               "year":"2017",
               "val":102002
            },
            {
               "year":"2018",
               "val":87391
            },
            {
               "year":"2019",
               "val":74518
            }
         ]
      }
   ],
   "values":[
      {
         "year":"2017",
         "val":287783
      },
      {
         "year":"2018",
         "val":260622
      },
      {
         "year":"2019",
         "val":158487
      }
   ],
   "view":[
      "gt",
      "m",
      "t"
   ]
}

```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Deployment

The build is served under a web server, it won't work from file://. Because the router's __history mode__ is activated by default in this project, don't forget to add an htaccess to allow the url rewrite (and turn on mod_rewrite on your server). For Apache, the server configuration will look like this:

``` bash
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

See more about this [here](https://router.vuejs.org/en/essentials/history-mode.html)

## Contributing

While there is no strict guideline right now, you are welcome to bring your ideas and pull requests.

As a rule of the thumb, keep **PSR-2** and **tests** in mind.

## Reporting Issues

For submitting an issue, please follow the steps below:

1. Check in open and closed issues if your inquiry was reported before by somebody else.
2. Propose a PR if you feel to do so

## Security Vulnerabilities

If you discover a security vulnerability, please send an email immediately to Alberto Pereira at [albertopereira@gmail.com](mailto:albertopereira@gmail.com). **Do not create an issue for the vulnerability.**