(function () {
    const root = document.documentElement;
    const toggleButton = document.getElementById("theme-toggle");

    let themeToggleCount = 0;
    let themeToggleLastTime = 0;

    function currentTheme() {
        const attr = root.getAttribute("data-theme");
        if (attr === "dark" || attr === "light") {
            return attr;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function toggleTheme() {
        const next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);

        const now = Date.now();
        if (now - themeToggleLastTime > 4000) {
            themeToggleCount = 0;
        }
        themeToggleLastTime = now;
        themeToggleCount += 1;

        if (themeToggleCount >= 5) {
            themeToggleCount = 0;
            showFlakyToast();
        }
    }

    toggleButton.addEventListener("click", toggleTheme);

    // Easter egg: Shift+D shortcut for the theme toggle.
    document.addEventListener("keydown", function (event) {
        if (event.shiftKey && event.key.toLowerCase() === "d") {
            toggleTheme();
        }
    });

    // Easter egg: toggling the theme 5 times in a row (within 4s) is "flaky".
    const flakyToast = document.getElementById("flaky-toast");
    let flakyToastTimer = null;

    function showFlakyToast() {
        clearTimeout(flakyToastTimer);
        flakyToast.classList.add("is-visible");
        flakyToastTimer = setTimeout(function () {
            flakyToast.classList.remove("is-visible");
        }, 2200);
    }

    // Easter egg: typing "test" anywhere runs a fake test suite.
    const testSuiteToast = document.getElementById("test-suite-toast");
    const testSuiteBarFill = document.getElementById("test-suite-bar-fill");
    const testSuiteResult = document.getElementById("test-suite-result");
    let testSuiteTimer = null;
    let typedBuffer = "";

    function runFakeTestSuite() {
        if (testSuiteToast.classList.contains("is-visible")) {
            return;
        }

        testSuiteResult.classList.remove("is-visible");
        testSuiteBarFill.style.transition = "none";
        testSuiteBarFill.style.width = "0%";
        void testSuiteBarFill.offsetWidth;
        testSuiteBarFill.style.transition = "";
        testSuiteToast.classList.add("is-visible");

        requestAnimationFrame(function () {
            testSuiteBarFill.style.width = "100%";
        });

        clearTimeout(testSuiteTimer);
        setTimeout(function () {
            testSuiteResult.classList.add("is-visible");
        }, 1500);
        testSuiteTimer = setTimeout(function () {
            testSuiteToast.classList.remove("is-visible");
        }, 3200);
    }

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
            return;
        }
        typedBuffer = (typedBuffer + event.key.toLowerCase()).slice(-10);
        if (typedBuffer.endsWith("test")) {
            runFakeTestSuite();
        }
    });

    // Easter egg: click the avatar 5 times in a row.
    const avatar = document.getElementById("avatar");
    const avatarCaption = document.getElementById("avatar-caption");
    let avatarClickCount = 0;
    let avatarLastClickTime = 0;
    let avatarCaptionTimer = null;

    avatar.addEventListener("click", function () {
        const now = Date.now();
        if (now - avatarLastClickTime > 1200) {
            avatarClickCount = 0;
        }
        avatarLastClickTime = now;
        avatarClickCount += 1;

        if (avatarClickCount >= 5) {
            avatarClickCount = 0;
            avatar.classList.remove("is-shaking");
            void avatar.offsetWidth;
            avatar.classList.add("is-shaking");
            avatarCaption.classList.add("is-visible");
            clearTimeout(avatarCaptionTimer);
            avatarCaptionTimer = setTimeout(function () {
                avatarCaption.classList.remove("is-visible");
            }, 2500);
        }
    });

    // Easter egg: tab title changes while you're away.
    const originalTitle = document.title;
    window.addEventListener("blur", function () {
        document.title = "Test paused ⏸️";
    });
    window.addEventListener("focus", function () {
        document.title = originalTitle;
    });
})();
