/* ============================================================
   ViralForge — ui/cn.js
   Reusable UI utility: class name merger (clsx + tailwind-merge).
   Falls back to a plain truthy filter when VF is unavailable.
   ============================================================ */

(function () {
  const cn = (window.VF && window.VF.cn)
    ? window.VF.cn
    : function () {
        return Array.prototype.filter.call(arguments, Boolean).join(" ");
      };
  window.Ui = { cn };
})();