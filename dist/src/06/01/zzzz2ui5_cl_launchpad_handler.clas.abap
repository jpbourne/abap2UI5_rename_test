CLASS zzzz2ui5_cl_launchpad_handler DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    INTERFACES if_http_extension.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.



CLASS zzzz2ui5_cl_launchpad_handler IMPLEMENTATION.

  METHOD if_http_extension~handle_request.

    zzzz2ui5_cl_http_handler=>run( server ).

  ENDMETHOD.

ENDCLASS.
