    <script id="tLinkerInfo" type="text/template7" charset="utf-8">
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
          <div data-page="linker-info" class="page" id="linker-info">
            <!-- Scrollable page content-->
            <div class="page-content">
                <div class="list-block">
                    <form action="/saveLinkman" method="post" enctype="x-www-form-urlencoded" class="ajax-submit">
                      <input type="hidden" class="_id" name="_id" value="{{data[0]._id}}">
                      <ul>
                        <!-- Text inputs -->
                        <li>
                          <a href="#" class="item-link smart-select" data-searchbar="true" data-searchbar-placeholder="Search fruits">
                            <!-- select -->
                            <select name="customerId">
                              {{#unless data[0].customerId}}
                                     <option  selected>选择客户</option>
                              {{/unless}}
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
                              <div class="item-title label">姓名</div>
                              <div class="item-input">
                                <input type="text" name="name" value="{{data[0].name}}" placeholder="Name">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">称呼</div>
                              <div class="item-input">
                                <input type="text" name="call" value="{{data[0].call}}" placeholder="Call">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">邮箱</div>
                              <div class="item-input">
                                <input type="email" name="email" value="{{data[0].email}}" placeholder="E-mail">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">电话</div>
                              <div class="item-input">
                                <input type="tel" placeholder="phone" value="{{data[0].phone}}" name="phone">
                              </div>
                            </div>
                          </div>
                        </li>
                          <li>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">职务</div>
                              <div class="item-input">
                                <input type="text" value="{{data[0].job}}" name="job" placeholder="job">
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
						<input id="l-add-saveLinker" type="submit" class="button active" style="height:40px;line-height:40px;" value="确定">
				  </div>
                  </form>
				</div>
            </div>
          </div>
        </div>
    </script>
