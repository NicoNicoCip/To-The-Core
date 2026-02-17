// Set up collision box manually (32x32 centered)
// Since sprites aren't loading, we need to set bbox directly

this.bbox_left = this.x - 16;
this.bbox_top = this.y - 16;
this.bbox_right = this.x + 16;
this.bbox_bottom = this.y + 16;