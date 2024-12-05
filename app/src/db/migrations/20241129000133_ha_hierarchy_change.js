exports.up = function (knex) {
  return Promise.resolve()
    .then(() => knex.schema.dropViewIfExists('ha_hierarchy'))
    .then(() =>
      knex.schema.raw(`CREATE OR REPLACE VIEW ha_hierarchy AS
  WITH community_expanded AS (
    SELECT
        jsonb_array_elements(submission->'communities') AS community,
        submission->>'healthAuthority' AS "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        submissions_data_vw
),
pcn_expanded AS (
    SELECT
        community->>'communityName' AS "communityName",
        jsonb_array_elements(community->'pcn') AS pcn,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        community_expanded
),
chc_expanded AS (
    SELECT
        "communityName",
        pcn->>'pcnName' AS "pcnName",
        pcn->>'pcnType' AS "pcnType",
        jsonb_array_elements(pcn->'chc') AS chc,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_expanded
),
upcc_expanded AS (
    SELECT
        "communityName",
        pcn->>'pcnName' AS "pcnName",
        pcn->>'pcnType' AS "pcnType",
        jsonb_array_elements(pcn->'upcc') AS upcc,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_expanded
),
fnpcc_expanded AS (
    SELECT
        "communityName",
        pcn->>'pcnName' AS "pcnName",
        pcn->>'pcnType' AS "pcnType",
        jsonb_array_elements(pcn->'fnpcc') AS fnpcc,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_expanded
),
nppcc_expanded AS (
    SELECT
        "communityName",
        pcn->>'pcnName' AS "pcnName",
        pcn->>'pcnType' AS "pcnType",
        jsonb_array_elements(pcn->'nppcc') AS nppcc,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_expanded
),
pcn_clinic_expanded AS (
    SELECT
        "communityName",
        pcn->>'pcnName' AS "pcnName",
        pcn->>'pcnType' AS "pcnType",
        jsonb_array_elements(pcn->'pcnClinic') AS pcnClinic,
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_expanded
),
chc_clinic_expanded AS (
    SELECT
        "communityName",
        "pcnName",
        "pcnType",
        chc->>'chcName' AS "chcName",
        NULL AS "upccName",
        NULL AS "upccTypeOfCare",
        NULL AS "fnpccName",
        NULL AS "nppccName",
        NULL AS "pcnClinicName",
        NULL AS "pcnClinicType",
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        chc_expanded
),
upcc_clinic_expanded AS (
    SELECT
        "communityName",
        "pcnName",
        "pcnType",
        NULL AS "chcName",
        upcc->>'upccName' AS "upccName",
        upcc->>'typeOfCare' AS "upccTypeOfCare",
        NULL AS "fnpccName",
        NULL AS "nppccName",
        NULL AS "pcnClinicName",
        NULL AS "pcnClinicType",
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        upcc_expanded
),
fnpcc_clinic_expanded AS (
    SELECT
        "communityName",
        "pcnName",
        "pcnType",
        NULL AS "chcName",
        NULL AS "upccName",
        NULL AS "upccTypeOfCare",
        fnpcc->>'fnpccName' AS "fnpccName",
        NULL AS "nppccName",
        NULL AS "pcnClinicName",
        NULL AS "pcnClinicType",
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        fnpcc_expanded
),
nppcc_clinic_expanded AS (
    SELECT
        "communityName",
        "pcnName",
        "pcnType",
        NULL AS "chcName",
        NULL AS "upccName",
        NULL AS "upccTypeOfCare",
        NULL AS "fnpccName",
        nppcc->>'nppccName' AS "nppccName",
        NULL AS "pcnClinicName",
        NULL AS "pcnClinicType",
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        nppcc_expanded
),
pcn_clinic_final AS (
    SELECT
        "communityName",
        "pcnName",
        "pcnType",
        NULL AS "chcName",
        NULL AS "upccName",
        NULL AS "upccTypeOfCare",
        NULL AS "fnpccName",
        NULL AS "nppccName",
        pcnClinic->>'clinicName' AS "pcnClinicName",
        pcnClinic->>'clinicType' AS "pcnClinicType",
        "healthAuthority",
        "formId",
        deleted,
        draft
    FROM
        pcn_clinic_expanded
),
all_clinics AS (
    SELECT * FROM chc_clinic_expanded
    UNION ALL
    SELECT * FROM upcc_clinic_expanded
    UNION ALL
    SELECT * FROM fnpcc_clinic_expanded
    UNION ALL
    SELECT * FROM nppcc_clinic_expanded
    UNION ALL
    SELECT * FROM pcn_clinic_final
)
SELECT
    row_number() OVER () AS id,
    "healthAuthority",
    "communityName",
    "pcnName",
    "pcnType",
    "pcnClinicName",
    "pcnClinicType",
    "chcName",
    "upccName",
    "upccTypeOfCare",
    "fnpccName",
    "nppccName",
    "formId",
    deleted,
    draft
FROM
    all_clinics
WHERE deleted != true AND draft != true;`)
    );
};

exports.down = function (knex) {
  return Promise.resolve()
    .then(() => knex.schema.dropViewIfExists('ha_hierarchy'))
    .then(() =>
      knex.schema.raw(`CREATE OR REPLACE VIEW ha_hierarchy AS
        WITH community_expanded AS (
          SELECT
              jsonb_array_elements(submission->'communities') AS community,
              submission->>'healthAuthority' AS "healthAuthority",
              "formId"
          FROM
              submissions_data_vw
      ),
      pcn_expanded AS (
          SELECT
              community->>'communityName' AS "communityName",
              jsonb_array_elements(community->'pcn') AS pcn,
              "healthAuthority",
              "formId"
          FROM
              community_expanded
      ),
      chc_expanded AS (
          SELECT
              "communityName",
              pcn->>'pcnName' AS "pcnName",
              pcn->>'pcnType' AS "pcnType",
              jsonb_array_elements(pcn->'chc') AS chc,
              "healthAuthority",
              "formId"
          FROM
              pcn_expanded
      ),
      upcc_expanded AS (
          SELECT
              "communityName",
              pcn->>'pcnName' AS "pcnName",
              pcn->>'pcnType' AS "pcnType",
              jsonb_array_elements(pcn->'upcc') AS upcc,
              "healthAuthority",
              "formId"
          FROM
              pcn_expanded
      ),
      fnpcc_expanded AS (
          SELECT
              "communityName",
              pcn->>'pcnName' AS "pcnName",
              pcn->>'pcnType' AS "pcnType",
              jsonb_array_elements(pcn->'fnpcc') AS fnpcc,
              "healthAuthority",
              "formId"
          FROM
              pcn_expanded
      ),
      nppcc_expanded AS (
          SELECT
              "communityName",
              pcn->>'pcnName' AS "pcnName",
              pcn->>'pcnType' AS "pcnType",
              jsonb_array_elements(pcn->'nppcc') AS nppcc,
              "healthAuthority",
              "formId"
          FROM
              pcn_expanded
      ),
      pcn_clinic_expanded AS (
          SELECT
              "communityName",
              pcn->>'pcnName' AS "pcnName",
              pcn->>'pcnType' AS "pcnType",
              jsonb_array_elements(pcn->'pcnClinic') AS pcnClinic,
              "healthAuthority",
              "formId"
          FROM
              pcn_expanded
      ),
      chc_clinic_expanded AS (
          SELECT
              "communityName",
              "pcnName",
              "pcnType",
              chc->>'chcName' AS "chcName",
              NULL AS "upccName",
              NULL AS "upccTypeOfCare",
              NULL AS "fnpccName",
              NULL AS "nppccName",
              NULL AS "pcnClinicName",
              NULL AS "pcnClinicType",
              "healthAuthority",
              "formId"
          FROM
              chc_expanded
      ),
      upcc_clinic_expanded AS (
          SELECT
              "communityName",
              "pcnName",
              "pcnType",
              NULL AS "chcName",
              upcc->>'upccName' AS "upccName",
              upcc->>'typeOfCare' AS "upccTypeOfCare",
              NULL AS "fnpccName",
              NULL AS "nppccName",
              NULL AS "pcnClinicName",
              NULL AS "pcnClinicType",
              "healthAuthority",
              "formId"
          FROM
              upcc_expanded
      ),
      fnpcc_clinic_expanded AS (
          SELECT
              "communityName",
              "pcnName",
              "pcnType",
              NULL AS "chcName",
              NULL AS "upccName",
              NULL AS "upccTypeOfCare",
              fnpcc->>'fnpccName' AS "fnpccName",
              NULL AS "nppccName",
              NULL AS "pcnClinicName",
              NULL AS "pcnClinicType",
              "healthAuthority",
              "formId"
          FROM
              fnpcc_expanded
      ),
      nppcc_clinic_expanded AS (
          SELECT
              "communityName",
              "pcnName",
              "pcnType",
              NULL AS "chcName",
              NULL AS "upccName",
              NULL AS "upccTypeOfCare",
              NULL AS "fnpccName",
              nppcc->>'nppccName' AS "nppccName",
              NULL AS "pcnClinicName",
              NULL AS "pcnClinicType",
              "healthAuthority",
              "formId"
          FROM
              nppcc_expanded
      ),
      pcn_clinic_final AS (
          SELECT
              "communityName",
              "pcnName",
              "pcnType",
              NULL AS "chcName",
              NULL AS "upccName",
              NULL AS "upccTypeOfCare",
              NULL AS "fnpccName",
              NULL AS "nppccName",
              pcnClinic->>'clinicName' AS "pcnClinicName",
              pcnClinic->>'clinicType' AS "pcnClinicType",
              "healthAuthority",
              "formId"
          FROM
              pcn_clinic_expanded
      ),
      all_clinics AS (
          SELECT * FROM chc_clinic_expanded
          UNION ALL
          SELECT * FROM upcc_clinic_expanded
          UNION ALL
          SELECT * FROM fnpcc_clinic_expanded
          UNION ALL
          SELECT * FROM nppcc_clinic_expanded
          UNION ALL
          SELECT * FROM pcn_clinic_final
      )
      SELECT
          row_number() OVER () AS id,
          "healthAuthority",
          "communityName",
          "pcnName",
          "pcnType",
          "pcnClinicName",
          "pcnClinicType",
          "chcName",
          "upccName",
          "upccTypeOfCare",
          "fnpccName",
          "nppccName",
          "formId"
      FROM
          all_clinics;`)
    );
};
