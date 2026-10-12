/* Axiom Web – publicly inspectable local-only content catalogue.
   No secrets, personal data or connection state belong in this file. */
window.AxiomGuide = Object.freeze({
  plans: {
    free: {
      name: "ChatGPT Free", label: "Basic", tagline: "Ohne Zusatzhardware einsteigen",
      intro: "Du verwendest ChatGPT als KI und kannst die Apps/Plugins nutzen, die für dein Konto freigeschaltet sind. Funktionen und Limits unterscheiden sich je nach Plugin.",
      needs: "ChatGPT-Free-Konto, Internet und gegebenenfalls die Freigabe der gewünschten App.",
      limits: "Free beinhaltet keinen allgemein freigegebenen benutzerdefinierten ChatGPT-MCP-Entwicklermodus.",
      example: "„Axiom, erklär mir die nächsten Schritte in meinem Python-Projekt.“",
      note: "Prüfe direkt im ChatGPT-App-Verzeichnis, welche Apps tatsächlich angeboten werden."
    },
    plus: {
      name: "ChatGPT Plus", label: "Personal", tagline: "Mehr Möglichkeiten mit ChatGPT-Apps",
      intro: "ChatGPT übernimmt die KI-Verarbeitung. Du ergänzt einzelne freigeschaltete Apps für den persönlichen Alltag und dein Projektmanagement.",
      needs: "ChatGPT Plus und gegebenenfalls eigene Konten bei den zu verbindenden Diensten.",
      limits: "Ein eigener frei definierter MCP-Server im ChatGPT-Entwicklermodus ist mit Plus nicht automatisch verfügbar.",
      example: "„Axiom, prüfe mein GitHub-Projekt und fasse offene Aufgaben zusammen.“",
      note: "Verbinde nur Apps, die einen konkreten Nutzen haben; wähle möglichst lesende Berechtigungen."
    },
    pro: {
      name: "ChatGPT Pro", label: "Developer", tagline: "Eigene MCP-Apps lesen und testen",
      intro: "Neben normalen ChatGPT-Apps lassen sich im verfügbaren Entwicklermodus eigene MCP-Anbindungen zum Lesen/Abrufen konfigurieren.",
      needs: "ChatGPT Pro und bei eigener MCP-Anbindung aktivierter Entwicklermodus.",
      limits: "Pro unterstützt bei eigenen MCP-Apps im Entwicklermodus derzeit nur Lesen/Abrufen, nicht vollständige Schreib- und Änderungsaktionen.",
      example: "„Axiom, zeig mir die vom MCP-Server bereitgestellten Statusinformationen.“",
      note: "Ein App-Connector mit eigenen Berechtigungen und eine Pro-MCP-App sind technisch unterschiedliche Integrationswege."
    },
    business: {
      name: "ChatGPT Business", label: "Workspace", tagline: "MCP im verwalteten Team",
      intro: "Eigene MCP-Apps einschließlich erweiterter Aktionen werden in Business als Beta über die Workspace-Verwaltung freigegeben.",
      needs: "Business-Workspace und Admin-/Owner-Freigabe; eigene MCP-App-Veröffentlichung erfordert passende Rechte.",
      limits: "In Business sind die Admins/Owner für Developer Mode und das Veröffentlichen eigener MCP-Apps zuständig.",
      example: "„Axiom, zeige die für meinen Workspace erlaubten Projektinformationen.“",
      note: "Plane zuerst mit dem Workspace-Administrator, welche Datenquellen und Aktionen erlaubt sein sollen."
    },
    enterprise: {
      name: "ChatGPT Enterprise / Edu", label: "Organization", tagline: "Kontrollierte MCP-Zugriffe mit Rollen",
      intro: "Organisationen können eigene MCP-Apps testen und freigeben. In Enterprise/Edu ermöglichen RBAC-Rollen eine gezielte Vergabe von Developer- und App-Zugriffen.",
      needs: "Enterprise-/Edu-Workspace, passende Rolle und ausdrückliche Berechtigung durch die Verwaltung.",
      limits: "Zugriff, Ausführung und Veröffentlichung können durch Richtlinien, RBAC und Adminfreigaben beschränkt sein.",
      example: "„Axiom, fasse die freigegebenen Informationen aus meinen Organisationstools zusammen.“",
      note: "Vor einer Integration sind Datenrichtlinien, Berechtigungen und Freigabeprozess mit dem Admin-Team abzustimmen."
    },
    none: {
      name: "Ohne ChatGPT", label: "Independent", tagline: "Eigener KI-Client statt ChatGPT",
      intro: "Du verwendest einen MCP-fähigen KI-Client mit lokalem oder anderweitig angebundenem Modell. Die KI-Software gehört dabei nicht automatisch zu Axiom.",
      needs: "MCP-fähiger KI-Client, kompatibles KI-Modell und – bei lokalem Betrieb – ausreichend Hardware.",
      limits: "ChatGPT-Apps und ChatGPT-Plugin-Rechte stehen einem anderen KI-Client nicht automatisch zur Verfügung.",
      example: "„Prüfe über meinen eigenen MCP-Client den Zustand meines Servers.“",
      note: "Axiom Independent ist eine Entwicklungsrichtung und derzeit keine fertig ausgelieferte Standalone-KI."
    }
  },
  modes: {
    chatgpt: {
      name: "ChatGPT + Plugins", slogan: "Der einfachste Einstieg",
      introduction: "Die Gespräche und die KI-Auswertung finden innerhalb von ChatGPT statt. Axiom organisiert die Aufgaben. Apps/Plugins können externe Dienste nur nutzen, wenn du diese zuvor verbindest und autorisierst.",
      requirements: [
        "Ein unterstütztes ChatGPT-Konto und Internet.",
        "Das Axiom-Plugin, sobald es öffentlich erhältlich ist; derzeit existiert eine private Version.",
        "Nur die zusätzlichen Apps, die du tatsächlich verwenden möchtest.",
        "Kein eigener Raspberry Pi, kein Server und kein lokal laufendes Sprachmodell erforderlich."
      ],
      steps: [
        "Öffne ChatGPT und prüfe die angebotenen Apps/Plugins.",
        "Verbinde die für deine Aufgabe benötigten Dienste und prüfe die Berechtigungen.",
        "Nutze Axiom, sobald eine Installation oder Freigabe für dein Konto besteht.",
        "Teste zuerst eine einfache, lesende Aufgabe und überprüfe die Antwort."
      ],
      flow: ["Du in ChatGPT", "Axiom 🐸", "Autorisierte Apps/Plugins"],
      reality: "Die Axiom-Website selbst verbindet keine ChatGPT-Konten und kann Plugins nicht automatisch installieren.",
      benefit: "Keine Serverwartung und kein zusätzlicher KI-API-Schlüssel für die Website."
    },
    hybrid: {
      name: "Hybrid mit eigener Hardware", slogan: "ChatGPT + dein Raspberry Pi oder Server",
      introduction: "ChatGPT bleibt das KI-Modell. Ein freigegebener Remote-Connector stellt den Zugriff auf deinen eigenen Pi, NAS, Mini-PC oder Desktop bereit. Du brauchst dafür kein lokales LLM.",
      requirements: [
        "ChatGPT mit einem tatsächlich verfügbaren und autorisierten Remote-Connector, etwa Remote Desktop Commander.",
        "Ein eigenes Gerät: Raspberry Pi, NAS, Mini-PC, Linux-Server oder Desktop-Rechner.",
        "Ein eingerichteter Connector, passende Berechtigungen und möglichst ein aktuelles Backup.",
        "Das eigene Gerät muss eingeschaltet und erreichbar sein, wenn du es nutzen willst; 24/7 nur für ständige Verfügbarkeit."
      ],
      steps: [
        "Richte deine Hardware ein und entscheide, welche Verzeichnisse oder Funktionen erreichbar sein dürfen.",
        "Installiere und konfiguriere einen unterstützten Remote-Connector gemäß dessen Anleitung.",
        "Schränke Dateizugriff und ausführbare Befehle möglichst eng ein.",
        "Verbinde den Connector mit ChatGPT und teste zunächst eine ungefährliche Leseabfrage."
      ],
      flow: ["ChatGPT + Axiom", "Freigegebener Remote-Connector", "Dein Pi / NAS / PC"],
      reality: "Ein Raspberry Pi stellt kein ChatGPT-Sprachmodell bereit. Er hostet hier nur deine eigenen Dateien oder Dienste.",
      benefit: "Du kannst eigene Infrastruktur nutzen, ohne ein lokales LLM betreiben zu müssen."
    },
    bridge: {
      name: "Eigener MCP-Server", slogan: "Werkzeuge über Model Context Protocol",
      introduction: "MCP verbindet einen KI-Client mit Werkzeugen, die ein MCP-Server bereitstellt. Der Server stellt Aktionen oder Informationen bereit, aber ist selbst nicht das Sprachmodell. Als KI-Client kann ChatGPT mit entsprechenden Rechten oder ein eigener MCP-fähiger Client dienen.",
      requirements: [
        "Ein Ort für deinen MCP-Server, z. B. Pi, Mini-PC, NAS, lokaler PC oder geeigneter Hosting-Dienst.",
        "Ein MCP-fähiger KI-Client; bei ChatGPT sind passende Plan- und Developer-Mode-Berechtigungen nötig.",
        "Ein geeigneter Verbindungsweg: ChatGPT verbindet sich mit Remote-MCP; private lokale Server brauchen beispielsweise einen Secure MCP Tunnel.",
        "Strikte Zugriffskontrolle, sicher verwahrte Schlüssel, begrenzte Werkzeuge und nachvollziehbare Tests."
      ],
      steps: [
        "Entscheide dich für den KI-Client: ChatGPT im unterstützten Entwicklermodus oder einen eigenen MCP-fähigen Client.",
        "Plane, welche konkreten Werkzeuge dein MCP-Server anbieten soll.",
        "Richte den MCP-Server mit minimalen Berechtigungen ein; halte Zugangsdaten aus dem öffentlichen Code heraus.",
        "Verbinde den KI-Client sicher und teste zunächst eine reine Leseaktion."
      ],
      flow: ["MCP-fähiger KI-Client", "Sichere MCP-Verbindung", "Dein MCP-Server"],
      reality: "Für einen eigenen MCP-Server ist ein lokales LLM NICHT zwingend nötig. Für eine ChatGPT-unabhängige Installation brauchst du aber eine andere KI-Lösung oder einen eigenen MCP-fähigen Client.",
      benefit: "Du definierst eigene Tools und behältst die Kontrolle über deine Serverimplementierung."
    }
  },
  combinations: {
    chatgpt: {
      free: {
        level: "Einsteigerweg", compatible: true,
        message: "Free + ChatGPT-Apps: geeignet für den Einstieg, soweit Axiom und die jeweiligen Plugins für Free tatsächlich freigegeben sind.",
        addRequirements: ["Beachte die Free-Nutzungslimits und mögliche Einschränkungen einzelner Apps."],
        addSteps: ["Prüfe die Verfügbarkeit von Axiom und der benötigten App im Plugin-Verzeichnis, bevor du etwas einrichtest."],
        recommendation: "Beginne mit einer App und einem kleinen Leseauftrag."
      },
      plus: {
        level: "Empfohlen für einfachen Start", compatible: true,
        message: "Plus + ChatGPT-Apps: nutze die in deinem Konto angebotenen Integrationen direkt in ChatGPT. Eigene MCP-Server brauchst du hier nicht.",
        addRequirements: ["Für jede externe App benötigst du die jeweilige Berechtigung; eine Plus-Mitgliedschaft verbindet keine Konten automatisch."],
        addSteps: ["Verbinde beispielsweise GitHub oder Kalender einzeln und prüfe mit einem Test, ob Axiom darauf zugreifen darf."],
        recommendation: "Ideal, wenn du keinen eigenen Server betreiben möchtest."
      },
      pro: {
        level: "Plugins statt MCP-Aufwand", compatible: true,
        message: "Pro + normale Apps: die vorhandenen Plugins kannst du ohne selbst betriebenen MCP-Server nutzen. Der Developer Mode ist dafür nicht notwendig.",
        addRequirements: ["Achte darauf, ob eine gewünschte Funktion über eine normale App oder nur über eine eigene MCP-App möglich ist."],
        addSteps: ["Entscheide pro Aufgabe, ob ein bestehender Plugin-Connector ausreicht; nutze erst dann bei Bedarf Developer Mode."],
        recommendation: "Pro lohnt sich hier nur für die zusätzlichen Funktionen, die du wirklich brauchst."
      },
      business: {
        level: "Workspace-kontrolliert", compatible: true,
        message: "Business + ChatGPT-Apps: Mitglieder verwenden nur die Apps, die der Workspace zulässt. Axiom kann solche Berechtigungen nicht umgehen.",
        addRequirements: ["Genehmigung der verwendeten Apps durch den Workspace, sofern erforderlich."],
        addSteps: ["Mit dem Workspace-Admin klären, welche Apps freigegeben sind; danach eine erlaubte Leseabfrage testen."],
        recommendation: "Für Teams zuerst Berechtigungen und Datentrennung festlegen."
      },
      enterprise: {
        level: "Rollenbasiert", compatible: true,
        message: "Enterprise/Edu + ChatGPT-Apps: Regeln der Organisation und RBAC-Berechtigungen bestimmen, welche Apps verfügbar sind.",
        addRequirements: ["Die passende organisatorische Rolle und eine freigegebene Datenquelle."],
        addSteps: ["Die erlaubten Apps und Zugriffsrollen mit dem Admin-Team prüfen und in einem Test mit nicht sensiblen Daten verifizieren."],
        recommendation: "Keine Freigaben annehmen, die dir nicht zugewiesen wurden."
      },
      none: {
        level: "Nicht passend", compatible: false,
        message: "Dieser Modus setzt ChatGPT voraus. Ohne ChatGPT kannst du dessen Apps nicht einfach verwenden.",
        addRequirements: ["Für eine ChatGPT-unabhängige Lösung wird ein eigener MCP-fähiger KI-Client benötigt."],
        addSteps: ["Wähle stattdessen „Eigener MCP-Server“ und prüfe die Anforderungen deines KI-Clients."],
        recommendation: "Wechsle zu einem eigenen Client; die Axiom-Standalone-Version ist noch in Planung."
      }
    },
    hybrid: {
      free: {
        level: "Verfügbarkeit prüfen", compatible: true,
        message: "Free + Hybrid: möglich, wenn dir ein geeigneter Remote-Connector tatsächlich angeboten wird und dein eigenes Gerät erreichbar ist. Die Free-Version garantiert diesen Zugriff nicht.",
        addRequirements: ["Prüfe im Free-Konto die Verfügbarkeit des gewünschten Remote-Connectors; ohne ihn funktioniert diese Variante nicht."],
        addSteps: ["Erst Connector-Zugang prüfen, dann einen Pi oder PC als Remote-Ziel konfigurieren."],
        recommendation: "Kaufe keine Hardware, bevor die Connector-Frage geklärt ist."
      },
      plus: {
        level: "Passender Hybrid-Einstieg", compatible: true,
        message: "Plus + Hybrid: ChatGPT übernimmt die KI; der Pi oder Mini-PC liefert eigene Dateien und Dienste. Der Zugang erfolgt über einen unterstützten Remote-Connector.",
        addRequirements: ["Ein eigener Rechner/Server sowie ein passender Remote-Connector mit erteilten Rechten."],
        addSteps: ["Richte zunächst einen lesenden Dateizugriff ein und teste danach gezielt einen Serverstatus."],
        recommendation: "Für Self-Hosting-Fans oft der praktische nächste Schritt ohne lokales LLM."
      },
      pro: {
        level: "Hybrid ohne Developer Mode", compatible: true,
        message: "Pro + Hybrid: die klassische Remote-Connector-Variante benötigt nicht automatisch einen eigenen MCP-Developer-Mode. Bei separaten benutzerdefinierten MCP-Apps gelten andere Regeln.",
        addRequirements: ["Ein freigegebener Remote-Connector und sichere Remote-Berechtigungen."],
        addSteps: ["Verwende den vorhandenen Remote-Connector oder wähle bewusst den separaten MCP-Modus, falls du eine eigene MCP-App entwickeln willst."],
        recommendation: "Hybrid ist nicht automatisch gleichbedeutend mit eigenem MCP-Server."
      },
      business: {
        level: "Admin-Abhängigkeit", compatible: true,
        message: "Business + Hybrid: ein freigegebener Remote-Connector kann auf eigene Team-Hardware zugreifen. Solche Zugriffe sollten administrativ geprüft werden.",
        addRequirements: ["Freigabe der App durch den Workspace und sichere Zugriffstrennung auf der Zielhardware."],
        addSteps: ["Zielsystem und Berechtigungen mit Admins abstimmen, anschließend Read-only-Zugriff testen."],
        recommendation: "Teamdaten niemals über einen privaten, unverwalteten Server routen."
      },
      enterprise: {
        level: "Kontrollierte Infrastruktur", compatible: true,
        message: "Enterprise/Edu + Hybrid: eine organisationsseitig genehmigte Remote-Anbindung kann eigene Infrastruktur einbeziehen; Rollen und Richtlinien bleiben verbindlich.",
        addRequirements: ["Genehmigter Connector, Netzwerkrichtlinien und RBAC-Zugriff auf die Datenquelle."],
        addSteps: ["Datenschutz, Logs und Connector-Rechte vor dem Zugriff mit dem Admin-Team abstimmen."],
        recommendation: "Testzugriffe auf einen isolierten, nicht produktiven Bereich begrenzen."
      },
      none: {
        level: "Anderer Modus nötig", compatible: false,
        message: "Der hier definierte Hybrid-Modus kombiniert ChatGPT mit eigener Hardware. Ohne ChatGPT wähle einen eigenen KI-Client und passenden MCP-Weg.",
        addRequirements: ["Für eine andere KI-Oberfläche ist eine getrennte Client- und Tool-Anbindung nötig."],
        addSteps: ["Wähle den MCP-Modus und prüfe, welcher Client und welches Modell für dein Gerät geeignet sind."],
        recommendation: "Keinen ChatGPT-Connector ohne ChatGPT voraussetzen."
      }
    },
    bridge: {
      free: {
        level: "Nicht direkt in Free", compatible: false,
        message: "ChatGPT Free bietet aktuell keinen allgemein nutzbaren eigenen MCP-Entwicklermodus. Ein selbst betriebener MCP-Server allein schaltet diese Funktion nicht frei.",
        addRequirements: ["Als Alternative brauchst du einen anderen MCP-fähigen KI-Client oder ein ChatGPT-Konto mit entsprechendem Zugang."],
        addSteps: ["Entscheide erst, ob du auf einen unterstützten Plan wechseln oder einen eigenen KI-Client nutzen möchtest."],
        recommendation: "Ohne verfügbaren KI-Client noch keinen eigenen MCP-Tunnel einrichten."
      },
      plus: {
        level: "Nicht direkt in Plus", compatible: false,
        message: "ChatGPT Plus ist nicht gleich Pro Developer Mode. Ein selbst gehosteter MCP-Server wird dadurch in ChatGPT nicht automatisch verfügbar.",
        addRequirements: ["Erforderlich ist entweder ein unterstützter Developer-Mode-Zugang oder ein anderer MCP-fähiger KI-Client."],
        addSteps: ["Nutze für Plus vorerst Apps/Plugins oder Hybrid; für eigene MCP-Werkzeuge einen alternativen Client prüfen."],
        recommendation: "Starte lieber im Hybrid-Modus, wenn du einen Raspberry Pi mit ChatGPT verwenden willst."
      },
      pro: {
        level: "MCP Lesen/Abrufen", compatible: true,
        message: "Pro + Developer Mode kann eigene Remote-MCP-Apps zum Lesen/Abrufen anbinden. Allgemeine Schreib-/Änderungsaktionen über diese benutzerdefinierten MCP-Apps sind derzeit nicht in Pro enthalten.",
        addRequirements: ["Aktivierter ChatGPT Developer Mode und ein von ChatGPT erreichbarer Remote-MCP-Endpunkt oder Secure MCP Tunnel."],
        addSteps: ["Developer Mode aktivieren, eigene App mit Remote-MCP-Endpunkt konfigurieren und ein reines Lesewerkzeug testen."],
        recommendation: "Einen Schreibzugriff nicht als gegeben einplanen, auch wenn dein MCP-Server solche Tools bereitstellt."
      },
      business: {
        level: "MCP Beta mit Adminfreigabe", compatible: true,
        message: "Business + eigene MCP-App: erweiterte Aktionen einschließlich Schreiben werden im Beta-Rahmen unterstützt. Admins/Owner verwalten Developer Mode und Veröffentlichung.",
        addRequirements: ["Business-Admin- oder Owner-Zugriff für Developer Mode und eigene App-Freigaben."],
        addSteps: ["App durch Admin/Owner privat testen, Sicherheitsprüfung durchführen und erst dann im Workspace veröffentlichen."],
        recommendation: "Schreibaktionen als gesonderte Risikoklasse behandeln und einzeln autorisieren."
      },
      enterprise: {
        level: "MCP Beta mit RBAC", compatible: true,
        message: "Enterprise/Edu + eigene MCP-App: erweiterte Aktionen werden in Beta angeboten. Berechtigte Entwickler können testen; Admins/Owner veröffentlichen und definieren RBAC-Zugriff.",
        addRequirements: ["Developer-Berechtigung per RBAC und passende Adminfreigaben für die Tool-Aktionen."],
        addSteps: ["Freigabeprozess mit Admins festlegen, MCP-App privat testen, Tool-Liste prüfen und Rollen vor Veröffentlichung zuweisen."],
        recommendation: "Neue oder geänderte Werkzeuge nicht ungeprüft auf bestehende Berechtigungen übernehmen."
      },
      none: {
        level: "Eigener KI-Stack", compatible: true,
        message: "Ohne ChatGPT brauchst du einen MCP-fähigen KI-Client. Das Modell kann auf deinem eigenen Rechner laufen oder über einen selbst gewählten Dienst erreichbar sein. Lokale Modelle benötigen ausreichend Leistung.",
        addRequirements: ["MCP-fähige Client-Software plus kompatibles Modell; GPU/RAM-Anforderungen hängen vom Modell ab."],
        addSteps: ["Modell/Client auswählen, MCP-Verbindung lokal prüfen, nur notwendige Tools freigeben und mit Read-only testen."],
        recommendation: "Ein MCP-Server ersetzt das Sprachmodell nicht. Eine eigenständige Axiom-KI ist ein späteres Entwicklungsziel."
      }
    }
  },
  integrations: {
    github: {
      name: "GitHub", icon: "💻",
      chatgpt: {
        description: "Axiom nutzt eine autorisierte GitHub-App zum Lesen von Repositories, Issues und Pull Requests – abhängig von deren verfügbaren Funktionen.",
        needs: "GitHub-Konto, App-Verfügbarkeit und genau die benötigten Repository-Rechte.",
        steps: ["GitHub-App in ChatGPT suchen.", "Verbindung autorisieren und den Repository-Zugriff einschränken.", "Mit einer Repository- oder Issue-Abfrage starten."],
        test: "„Axiom, liste die offenen Issues meines Projekts.“"
      },
      hybrid: {
        description: "GitHub bleibt über die ChatGPT-App erreichbar; dein Pi wird zusätzlich nur für lokal gespeicherten Code oder Tests gebraucht.",
        needs: "GitHub-App für Cloud-Repositories; Remote-Connector für lokale Projektdateien.",
        steps: ["GitHub-App verbinden.", "Lokales Projekt über den Remote-Connector auf einen erlaubten Pfad beschränken.", "Erst Status und Änderungen lesen, bevor du einen Commit autorisierst."],
        test: "„Vergleiche das GitHub-Repo mit dem lokalen Projektstand.“"
      },
      bridge: {
        description: "Ein eigener MCP-Server stellt ausgewählte GitHub-Werkzeuge bereit. Der KI-Client ruft diese erst nach Freigabe auf.",
        needs: "MCP-fähiger Client, GitHub-Zugriffstoken mit minimalen Rechten und abgesicherte Serverkonfiguration.",
        steps: ["Nur benötigte GitHub-API-Funktionen als MCP-Tools anbieten.", "Secrets ausschließlich lokal sicher verwahren.", "Mit dem Lesen eines Repositories starten."],
        test: "„Lies über meinen MCP-Server die letzten Commits.“"
      }
    },
    outlook: {
      name: "Outlook E-Mail", icon: "✉️",
      chatgpt: {
        description: "Eine autorisierte Outlook-App kann Posteingang und Entwürfe zugänglich machen, soweit diese Fähigkeiten angeboten werden.",
        needs: "Microsoft-Konto, verfügbarer Outlook-Connector und passende Mail-Leserechte.",
        steps: ["Outlook-App auswählen und Microsoft-Zugang autorisieren.", "Nur passende Mail-Berechtigungen erlauben.", "Zuerst ungelesene Betreffzeilen oder einen Ordner abfragen."],
        test: "„Welche wichtigen ungelesenen Outlook-Mails habe ich?“"
      },
      hybrid: {
        description: "Outlook bleibt ein externer Cloud-Dienst; der eigene Server ist dafür nicht erforderlich. Hybrid kann zusätzlich lokale Dokumente bereitstellen.",
        needs: "Outlook-App plus getrennt autorisierter Remote-Connector nur bei Bedarf.",
        steps: ["Outlook-App separat verbinden.", "Lokale Dateien nur über einen ausdrücklich freigegebenen Pfad einbinden.", "Keine automatische Weiterleitung von Mails an den Pi konfigurieren."],
        test: "„Fasse eine Mail zusammen und suche ein passendes lokales Dokument.“"
      },
      bridge: {
        description: "Ein eigener MCP-Server kann ausgewählte Microsoft-Graph-Daten bereitstellen. Dafür sind eigene OAuth-Berechtigungen und sichere Tokenverwaltung nötig.",
        needs: "MCP-Client, abgesicherte Microsoft-Graph-Anbindung und Zustimmung für angefragte Berechtigungen.",
        steps: ["Graph-App mit begrenzten Rechten planen.", "OAuth-Tokens verschlüsselt und außerhalb von Git speichern.", "Nur sichere Lese-/Suchtools anbieten und zuerst testen."],
        test: "„Lies die Betreffzeilen aus meinem Outlook-Posteingang.“"
      }
    },
    calendar: {
      name: "Kalender", icon: "📅",
      chatgpt: {
        description: "Du liest Termine über eine bereits verfügbare Kalender-App, zum Beispiel aus einem autorisierten Outlook-Kalender.",
        needs: "Ein Kalenderkonto und eine freigegebene, unterstützte Kalender-App.",
        steps: ["Kalender-App verbinden und Kalender auswählen.", "Leseberechtigungen kontrollieren.", "Nächste Termine mit Datum und Zeitzone abfragen."],
        test: "„Was steht morgen in meinem Kalender?“"
      },
      hybrid: {
        description: "Dein Kalender kommt aus der verbundenen Kalender-App; bei Bedarf ergänzt Axiom lokale Ressourcen wie eigene Fahrzeitnotizen.",
        needs: "Kalender-Connector und für lokale Zusatzdaten ein separater Remote-Zugriff.",
        steps: ["Kalender zuerst alleine testen.", "Zusätzliche lokale Datenquellen mit minimalem Zugriff ergänzen.", "Ergebnisse auf korrekte Zeitzonen prüfen."],
        test: "„Zeige den nächsten Termin und die zugehörige lokale Notiz.“"
      },
      bridge: {
        description: "Ein eigener MCP-Server kann lesende Kalender-Werkzeuge anbieten, zum Beispiel über Microsoft Graph oder eine CalDAV-Anbindung.",
        needs: "MCP-fähiger Client und gesicherte Kalenderzugangsdaten oder OAuth-Berechtigungen.",
        steps: ["Kalender-API auswählen.", "Token/Anmeldedaten geschützt verwahren.", "Terminsuche als Lesewerkzeug anbieten und Zeitzonen testen."],
        test: "„Lies über MCP meine nächsten drei Termine.“"
      }
    },
    "remote-desktop": {
      name: "Remote Desktop / Server", icon: "🖥️",
      chatgpt: {
        description: "Ohne eigenen Rechner gibt es hier nichts fernzusteuern. Sobald du einen Pi, NAS oder Desktop einbindest, entspricht die Nutzung dem Hybrid-Modus.",
        needs: "Ein tatsächlich erreichbarer eigener Rechner und ein autorisierter Remote-Connector.",
        steps: ["Prüfen, ob du wirklich eigene Hardware einbinden möchtest.", "Falls ja, Hybrid-Modus auswählen.", "Dann einen eingeschränkten Lesetest durchführen."],
        test: "„Zeige den Status meines Raspberry Pi.“"
      },
      hybrid: {
        description: "Das ist die typische Hybrid-Integration: ein Connector vermittelt zwischen ChatGPT und deinem eigenen Pi, Mini-PC, NAS oder Desktop.",
        needs: "Eigenes Zielgerät, unterstützter Remote-Connector, Netzverbindung und minimal erforderliche Rechte.",
        steps: ["Connector auf dem autorisierten System einrichten.", "Pfade und zulässige Operationen explizit begrenzen.", "Per Lesezugriff Benutzer und Zielpfad prüfen; Änderungen separat freigeben."],
        test: "„Lies die Statusdatei auf meinem Server, ohne etwas zu verändern.“"
      },
      bridge: {
        description: "Beim MCP-Weg stellst du eigene, klar begrenzte Server-Werkzeuge bereit. Das ist nicht automatisch der gleiche Connector wie Remote Desktop Commander.",
        needs: "MCP-Server mit sicheren Datei- oder Status-Tools, erreichbarer MCP-Client und eng begrenzten Rechten.",
        steps: ["Nur bestimmte Status-, Datei- oder Diagnosefunktionen anbieten.", "Keine Shell mit uneingeschränkten Rechten veröffentlichen.", "Read-only-Test durchführen und Logausgaben auf sensible Inhalte prüfen."],
        test: "„Rufe das freigegebene MCP-Tool server.status auf.“"
      }
    }
  },
  documentation: {
    mcp: "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt",
    apps: "https://help.openai.com/en/articles/11487775-connectors-in-chatgpt",
    github: "https://github.com/JayD-labs/axiom-web"
  }
});
