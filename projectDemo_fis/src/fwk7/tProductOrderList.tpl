
    <script id="tProductOrderList" type="text/template7" charset="utf-8">
        {{#each data}}
            <li class="item-content">
              <div class="item-inner" data-id="{{_id}}">
                <div class="item-title" style="width:100%;">{{name}}</div>
                <div class="item-input"><input type="number" data-use="real_price"  value="{{#if real_price}}{{real_price}}{{else}}{{price}}{{/if}}" placeholder="Price"></div> ×
                <div class="item-input t-input"><input  type="number"  data-use="size" value="{{size}}" placeholder="数量"></div>
              </div>
    </li>
        {{/each}}
        <input type="hidden" id="select_products_json" name="select_products_json" value='{{json_data}}'>
    </script>
