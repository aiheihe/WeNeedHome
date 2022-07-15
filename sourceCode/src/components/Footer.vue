<template>
    <div class="footer">
        <div>
            数据来源：<a href="https://github.com/WeNeedHome/SummaryOfLoanSuspension" target="_blank">SummaryOfLoanSuspension</a>
        </div>
        <div>
            经纬度来源：<a href="https://lbs.amap.com/api/webservice/guide/api/georegeo" target="_blank">高德地图地理编码API(非精确)</a>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 10px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  a {
    color: #B2182B;
    text-decoration: dashed;
  }
}
</style>
