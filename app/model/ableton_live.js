const MonomeGrid = require("./monome_grid");


class AbletonLive {
  constructor() {
    this.controller = new MonomeGrid(this);
  }


  async connectToGrid() {
    const msg = await this.controller.connect();
    return msg;
  }
}


module.exports = AbletonLive;
