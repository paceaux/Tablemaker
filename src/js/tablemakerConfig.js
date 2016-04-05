  /*==========
  #TABLEMAKER #CONFIG
  ==========*/

/* the tablemaker object is already pretty big. moved the default configs out.
Besides that, this is an example of what the config MUST look like for building a table from JSON*/
var tmDefaultConfig = {
  layout: {
    header: {
      rows: 0,
      cols: 0,
    },
    body: {
      rows: 1,
      cols: 2,
    },
    footer: {
      rows: 0,
      cols: 0,
    },
    colgroups: 0,
  },
  meta: {
    summary: '',
    caption: '',
  },
  classes: {
    table: '',
    rows: {
      even: '',
      odd: '',
      nth: '',
    },
    cols: {
      even: '',
      odd: '',
      nth: '',
    }
  },
};
