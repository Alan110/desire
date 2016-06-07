    <script id="tUserInfo" type="text/template7" charset="utf-8">
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
          <div data-page="user-info" class="page" id="user-info">
            <!-- Scrollable page content-->
            <div class="page-content">
                <div class="list-block">
                    <form action="/saveUser" method="post" enctype="x-www-form-urlencoded" class="ajax-submit">
                      <input type="hidden" class="_id" name="_id" value="{{data[0]._id}}">
                      <ul>
                        <!-- Text inputs -->            
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">用户名</div>
                              <div class="item-input">
                                <input type="text" name="name" value="{{data[0].name}}" placeholder="Name">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">密码</div>
                              <div class="item-input">
                                <input type="text" name="pswd" value="{{data[0].pswd}}" placeholder="Name">
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
                        <li data-role="{{data[0].role}}" {{#js_compare "this.data[0].userRole != '1' "}}style="display:none;"{{/js_compare}}
>
                          <a href="#" class="item-link smart-select" data-searchbar="true" data-searchbar-placeholder="Search fruits">
                            <!-- select -->
                            <select name="role" value={{data[0].role}}>
                                <option>请选择</opton>
                                <option value="1" {{#js_compare "this.data[0].role == '1' "}}selected=selected{{/js_compare}}>系统管理员</opton>
                                <option value="2" {{#js_compare "this.data[0].role == '2' "}}selected=selected{{/js_compare}}>产品管理员</opton>
                                <option value="3" {{#js_compare "this.data[0].role == '3' "}}selected=selected{{/js_compare}}>销售员</opton>   
                            </select>
                            <div class="item-content">
                              <div class="item-inner">
                                <div class="item-title">用户角色</div>
                                <div class="item-after"></div>
                              </div>
                            </div>
                          </a>
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
						<input id="l-add-saveUser" type="submit" class="button active" style="height:40px;line-height:40px;" value="确定">
				  </div>
                  </form>
				</div>
            </div>
          </div>
        </div>
    </script>
