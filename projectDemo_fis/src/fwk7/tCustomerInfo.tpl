<script id="tCustomerInfo" type="text/template7" charset="utf-8">
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
          <div data-page="customer-info" class="page" id="customer-info">
            <!-- Scrollable page content-->
            <div class="page-content">
                <div class="list-block">
                    <form action="/saveCustomer" method="post" enctype="x-www-form-urlencoded" class="ajax-submit">
                      <input type="hidden" class="_id" name="_id" value="{{data[0]._id}}">
                      <ul>
                        <!-- Text inputs -->
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">客户名称</div>
                              <div class="item-input">
                                <input type="text" name="name" class="name" value="{{data[0].name}}" placeholder="Name">
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
                              <!-- Additional "smart-select" class -->
                              <a href="#" class="item-link smart-select">
                                <!-- select -->
                                <select name="linker" multiple>
                                    {{#each allLinkerNames}}
                                      <option value="{{_id}}" {{#if select}}selected{{/if}}>{{name}}</option>
                                    {{/each}}
                                </select>
                                <div class="item-content">
                                  <div class="item-inner">
                                    <!-- Select label -->
                                    <div class="item-title">联系人</div>
                                    <!-- Selected value, not required -->
                                    <div class="item-after"></div>
                                  </div>
                                </div>
                              </a>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">客户地址</div>
                              <div class="item-input">
                                <input type="text" placeholder="address" value="{{data[0].address}}" name="address">
                              </div>
                            </div>
                          </div>
                        </li>
                        <!-- Select -->
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">客户类型</div>
                              <div class="item-input">
                                <select  value="">
                                  <option>客户</option>
                                  <option>分销商</option>
                                  <option>渠道供应商</option>
                                  <option>集成商</option>
                                  <option>合作伙伴</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </li>
                        <!-- 商机状态 -->
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">客户类型</div>
                              <div class="item-input">
                                <select>
                                  <option>有意向</option>
                                  <option>无意向</option>
                                  <option>已成交</option>
                                  <option>引导使用</option>
                                  <option>未续费</option>
                                  <option>待续费</option>
                                  <option>已续费</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">员工人数</div>
                              <div class="item-input">
                                <input type="number" name="peopleNum" value="{{data[0].peopleNum}}" placeholder="Number">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">所有者</div>
                              <div class="item-input">
                                <input type="text" name="owner" value="{{data[0].owner}}" placeholder="owner">
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div class="item-content">
                            <div class="item-inner">
                              <div class="item-title label">主要联系人</div>
                              <div class="item-input">
                                <input type="text" name="mainRelate" value="{{data[0].mainRelate}}" placeholder="mainRelate">
                              </div>
                            </div>
                          </div>
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
						<a href="#" id="l-add-link" class="button active" style="height:40px;line-height:40px;">创建联系人</a>
				  </div>
				  <div class="content-block-title">
						<input id="l-add-saveCustomer" type="submit" class="button active" style="height:40px;line-height:40px;" value="确定">
				  </div>
                  </form>
				</div>
            </div>
          </div>
        </div>
    </script>
