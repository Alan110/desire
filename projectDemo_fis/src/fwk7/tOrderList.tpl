
    <script id="tOrderList" type="text/template7" charset="utf-8">
        <ul>
            {{#each data}}
              <li class="swipeout" data-id="{{_id}}">
                  <div class="swipeout-content item-content">
                    <div class="item-inner" style="width:100%;"> 
                      <div class="item-title" style="width:100%;">
                        <div class="row t-vertical-center" >
                            <div class="">
                                {{customer.name}}
                                <div class="t-order-time">{{createTime}}</div>
                            </div>
                            <div style="max-width:207px;">{{_id}}</div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="swipeout-actions-right">
                        <a href="#" class="swipeout-delete" data-id="{{_id}}">Delete</a>
                  </div>
             </li>
            {{/each}}
        </ul>
    </script>
