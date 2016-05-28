    <script id="tOrderInfo" type="text/template7" charset="utf-8">
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
          <div data-page="order-info" class="page" id="linker-info">
            <!-- Scrollable page content-->
            <div class="page-content">
                <div class="list-block">
                    <form action="/saveOrder" id="t-order-form" method="post" enctype="x-www-form-urlencoded" >
                      <input type="hidden" class="_id" name="_id" value="{{data[0]._id}}">
                      <ul>
                        {{#if data[0]._id}}
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">订单编号</div>
                              <div class="item-input">
                                <input type="text" name="name" value="{{data[0]._id}}" placeholder="Name">
                              </div>
                            </div>
                          </div>
                        </li>
                        {{/if}}
                        <li>
                          <a href="#" class="item-link smart-select" data-searchbar="true" data-searchbar-placeholder="Search fruits">
                            <!-- select -->
                            <select name="customerId">
                              {{#each data[0].allCustomerNames}}
                                  <option value="{{_id}}" {{#if select}} selected {{/if}}>{{name}}</option>
                              {{/each}}
                            </select>
                            <div class="item-content">
                              <div class="item-inner">
                                <div class="item-title">客户名称</div>
                                <div class="item-after"></div>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">购买类型</div>
                              <div class="item-input">
                                <select  value="{{data[0].buyType}}" name="buyType">
                                  <option >type</option>
                                  <option value="0">首次购买</option>
                                  <option value="1">增加名额</option>
                                  <option value="2">续费</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </li>

                        <!-- 分隔元素 -->
                        <li class="item-divider t-gap"></li>
                        <li>
                          <a href="#" class="item-link smart-select" data-searchbar="true" data-searchbar-placeholder="Search fruits">
                            <!-- select -->
                            <select name="productId" multiple>
                              {{#unless data[0].customerId}}
                              {{/unless}}
                              {{#each data[0].allProductNames}}
                                  <option value="{{_id}}" {{#if select}} selected {{/if}}>{{name}}</option>
                              {{/each}}
                            </select>
                            <div class="item-content">
                              <div class="item-inner">
                                <div class="item-title">产品集</div>
                                <div class="item-after t-order-plist">选择产品</div>
                              </div>
                            </div>
                          </a>
                        </li>

<div class="list-block inset" id="t-order-selectProductList" style="margin:5px 15px;">
        {{#each data[0].select_products}}
            <li class="item-content">
              <div class="item-inner" data-id="{{_id}}">
                <div class="item-title" style="width:100%;">{{name}}</div>
                <div class="item-input"><input type="number" data-use="real_price"  value="{{#if real_price}}{{real_price}}{{else}}{{price}}{{/if}}" ></div> ×
                <div class="item-input t-input"><input  type="number"   data-use="size" value="{{size}}" placeholder="数量"></div>
              </div>
    </li>
        {{/each}}
        <input type="hidden" id="select_products_json" name="select_products_json" value='{{data[0].select_products_json}}'>
</div>

                    
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">总额</div>
                              <div class="item-input">
                                <input type="text" id="select_products_allPrice" name="allPrice" value="{{data[0].allPrice}}" placeholder="0">
                              </div>
                            </div>
                          </div>
                        </li>

                        <!-- 分隔元素 -->
                        <li class="item-divider t-gap"></li>

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
						<input id="l-add-saveOrder" type="submit" class="button active" style="height:40px;line-height:40px;" value="确定">
				  </div>
                  </form>
				</div>
            </div>
          </div>
        </div>
    </script>
