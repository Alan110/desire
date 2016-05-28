    <script id="tProductInfo" type="text/template7" charset="utf-8">
        <div class="navbar">
          <div class="navbar-inner">
            <div class="left"><a href="#" class="link back"> <i class="icon icon-back"></i><span>Back</span></a></div>
            <div class="center sliding">{{data[0].title}}</div>
            <div class="right">
              <!-- Right link contains only icon - additional "icon-only" class--><a href="#" class="link icon-only open-panel"> <i class="icon icon-bars"></i></a>
            </div>
          </div>
        </div>
        <div class="pages">
          <!-- Page, data-page contains page name-->
          <div data-page="product-info" class="page" id="linker-info">
            <!-- Scrollable page content-->
            <div class="page-content">
                <div class="list-block">
                    <form action="/saveProduct" method="post" enctype="x-www-form-urlencoded" class="ajax-submit">
                      <input type="hidden" class="_id" name="_id" value="{{data[0]._id}}">
                      <ul>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">产品名称</div>
                              <div class="item-input">
                                <input type="text" name="name" value="{{data[0].name}}" placeholder="Name">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">价格</div>
                              <div class="item-input">
                                <input type="number" name="price" value="{{data[0].price}}" placeholder="price">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">备注</div>
                              <div class="item-input">
                                <textarea placeholder="note"  name="note">{{data[0].note}}</textarea>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
				  <div class="content-block-title">
						<input id="l-add-saveProduct" type="submit" class="button active" style="height:40px;line-height:40px;" value="确定">
				  </div>
                  </form>
				</div>
            </div>
          </div>
        </div>
    </script>
