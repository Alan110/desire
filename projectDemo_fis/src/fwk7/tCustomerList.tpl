    <script id="tCustomerList" type="text/template7" charset="utf-8">
        <ul>
            {{#each data}}
              <li class="swipeout" data-id="{{_id}}">
                  <div class="swipeout-content item-content">
                    <div class="item-inner"> 
                      <div class="item-title">{{name}}</div>
                    </div>
                  </div>
                  <div class="swipeout-actions-right">
                        <a href="#" class="swipeout-delete" data-id="{{_id}}">Delete</a>
                  </div>
             </li>
            {{/each}}
        </ul>
    </script>
